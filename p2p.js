const WebSocket = require("ws");
const read =require("readline-sync")
let server_me;
let p2p_port = read.question("p2p port:") || 1300;
let sockets = [];
let broadcast=(message)=>{
    sockets.forEach(socket =>write(socket,message));
};
let initMessageHandler=(ws)=>{
    ws.on('message',(data)=>{
        if(ws!==server_me){
            console.log("收到了从端口"+ws._socket.remotePort+"发送来的信息:"+data)
            console.log("广播了一条信息")
            broadcast(data);
        }else{
            console.log("阻止了端口:"+ws._socket.remotePort+"回复的信息")
        }
    })
};
let initErrorHandler =(ws)=>{
    let closeConnection = (ws) => {
        console.log('从端口:'+ ws._socket.remotePort+"处断开连接");
        sockets.splice(sockets.indexOf(ws), 1);
    };
    ws.on('close',()=>closeConnection(ws));
    ws.on('error',()=>closeConnection(ws))
};
let initConnection = (ws) => {//初始化链接
    sockets.push(ws);
    console.log("连接端口数量为"+sockets.length);
    console.log("连接了端口"+sockets[sockets.length-1]._socket.remotePort);
    initMessageHandler(ws);
    initErrorHandler(ws);
};
let initP2PServer = () => {
    let server = new WebSocket.Server({port: p2p_port});
    server.on('connection', ws => {
        initConnection(ws)
    });
    let s = "ws://localhost:" + read.question("作为客户端要连接的端口:");

    let socket = new WebSocket(s);
    server_me = socket
    socket.on('open', () => {
        initConnection(socket)
    });
    socket.on('error', () => {
        console.log('连接失败:该端口可能未开启');
    })
    console.log('listening websocket p2p port on:' + p2p_port);
};

let write = (ws, message) => {
    console.log("该信息发送给了端口"+ws._socket.remotePort)
    ws.send(message)
};
process.stdin.setEncoding('utf-8');
process.stdin.on('readable', function () {
    const chunk = process.stdin.read();
    if (chunk !== null) {
        broadcast(chunk)
    }
})
initP2PServer();