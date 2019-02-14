
import ws from 'ws'


var SocketType = {
    initSocket : "kInitSocket",
    initSocketSuccess : "kInitSocketSuccess",
    initSocketError : "kInitSocketError",
    updateDoc : "kUpdateDoc", 

}


class SocketModel {

    socket:ws;
    cookie:string = "";
    doc_guid:string = "";
    
    constructor(socket:ws) {
        this.socket = socket;
    }
}



 




export class WebSocketManager {
    wss : ws.Server;
    socketArr : SocketModel[] = [];
    constructor() {
        console.log("开始建立连接..." + new Date());
        this.wss = new ws.Server({
            port: 3001,
            perMessageDeflate: {
              zlibDeflateOptions: {
                // See zlib defaults.
                chunkSize: 1024,
                memLevel: 7,
                level: 3
              },
              
              // Other options settable:
              clientNoContextTakeover: true, // Defaults to negotiated value.
              serverNoContextTakeover: true, // Defaults to negotiated value.
              serverMaxWindowBits: 10, // Defaults to negotiated value.
              // Below options specified as default values.
              concurrencyLimit: 10, // Limits zlib concurrency for perf.
              threshold: 1024 // Size (in bytes) below which messages
              // should not be compressed.
            }
        });
        this.wss.on('connection' , function connection(socket,request) {
            console.log(socket);
            console.log(request.headers);
            wsm.socketArr.push(new SocketModel(socket));
            socket.on('message',function incoming(message){
                let str = message.toString();
                let objs = JSON.parse(str);
            });
            socket.on('close',function close(code,reason){
                console.log('close: ' + code + " reason: " + reason);
                for (let index = 0; index < wsm.socketArr.length; index++) {
                    const element = wsm.socketArr[index];
                    if (socket === element.socket) {
                        wsm.socketArr.splice(index,1);
                        break;
                    }
                }
            });
            socket.on('open' , function open() {
                console.log('open');
            });
            socket.on('error', function error(err){
                console.log(err);
            });
    
            socket.send('11111');     
        });
    
        console.log("建立连接完成" + new Date())
        
    }
}



export let wsm = new WebSocketManager(); 

