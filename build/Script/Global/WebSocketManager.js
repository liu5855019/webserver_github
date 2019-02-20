"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = __importDefault(require("ws"));
var SocketType = {
    initSocket: "kInitSocket",
    initSocketSuccess: "kInitSocketSuccess",
    initSocketError: "kInitSocketError",
    updateDoc: "kUpdateDoc",
};
class SocketModel {
    constructor(socket) {
        this.cookie = "";
        this.doc_guid = "";
        this.socket = socket;
    }
}
class WebSocketManager {
    constructor() {
        this.socketArr = [];
        console.log("开始建立连接..." + new Date());
        this.wss = new ws_1.default.Server({
            port: 3001,
            perMessageDeflate: {
                zlibDeflateOptions: {
                    // See zlib defaults.
                    chunkSize: 1024,
                    memLevel: 7,
                    level: 3
                },
                // Other options settable:
                clientNoContextTakeover: true,
                serverNoContextTakeover: true,
                serverMaxWindowBits: 10,
                // Below options specified as default values.
                concurrencyLimit: 10,
                threshold: 1024 // Size (in bytes) below which messages
                // should not be compressed.
            }
        });
        this.wss.on('connection', function connection(socket, request) {
            console.log(socket);
            console.log(request.headers);
            exports.wsm.socketArr.push(new SocketModel(socket));
            socket.on('message', function incoming(message) {
                let str = message.toString();
                let objs = JSON.parse(str);
                if (objs.type === SocketType.initSocket) {
                    exports.wsm.actionWithInitSocket(socket, objs);
                }
            });
            socket.on('close', function close(code, reason) {
                console.log('close: ' + code + " reason: " + reason);
                for (let index = 0; index < exports.wsm.socketArr.length; index++) {
                    const element = exports.wsm.socketArr[index];
                    if (socket === element.socket) {
                        exports.wsm.socketArr.splice(index, 1);
                        break;
                    }
                }
            });
            socket.on('open', function open() {
                console.log('open');
            });
            socket.on('error', function error(err) {
                console.log(err);
            });
        });
        console.log("建立连接完成" + new Date());
    }
    //cookie
    //doc_guid
    actionWithInitSocket(socket, objs) {
        var model = null;
        for (let index = 0; index < exports.wsm.socketArr.length; index++) {
            const element = exports.wsm.socketArr[index];
            if (element.socket === socket) {
                model = element;
                break;
            }
        }
        if (model != null) {
            model.cookie = objs.cookie;
            model.doc_guid = objs.doc_guid;
            socket.send(JSON.stringify({ type: SocketType.initSocketSuccess }));
        }
        else {
            socket.send(JSON.stringify({ type: SocketType.initSocketSuccess }));
        }
    }
    actionWithUpdateDoc(doc_guid, count) {
        let waitForSend = [];
        for (let index = 0; index < this.socketArr.length; index++) {
            const element = this.socketArr[index];
            if (element.doc_guid === doc_guid) {
                waitForSend.push(element);
            }
        }
        for (let index = 0; index < waitForSend.length; index++) {
            const element = waitForSend[index];
            element.socket.send(JSON.stringify({ type: SocketType.updateDoc, count: count }));
        }
    }
}
exports.WebSocketManager = WebSocketManager;
exports.wsm = new WebSocketManager();
