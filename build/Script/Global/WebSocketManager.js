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
            socket.send('11111');
        });
        console.log("建立连接完成" + new Date());
    }
}
exports.WebSocketManager = WebSocketManager;
exports.wsm = new WebSocketManager();
