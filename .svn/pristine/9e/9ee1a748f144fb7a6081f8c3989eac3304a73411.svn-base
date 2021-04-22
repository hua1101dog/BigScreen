var websocket = require('ws');

var wss;

function send(spaceCode,type,msg){
    let data = {type:type,msg:msg};
    wss.clients.forEach(client=> {
        if (client.spaceCode == spaceCode) {
            client.send(JSON.stringify(data));
        }
    })
}

function handle(server){
    wss = new websocket.Server({
        server
    });

    //广播
    wss.broadcast = function broadcast(s, ws) {
        wss.clients.forEach(function each(client) {
            if (s == 1) {
                client.send(ws.name + ":" + ws.msg);
            }
            if (s == 0) {
                client.send(ws + "退出聊天室");
            }
        });
    };
// 初始化连接
    wss.on('connection', function(ws) {
        let message = {type:"greeting",msg:'你是第' + wss.clients.size + '位'};
        ws.send(JSON.stringify(message));
        // 接收消息并发送到客户端
        ws.on('message', function(jsonStr, flags) {
            var obj = eval('(' + jsonStr + ')');
            if(obj.type == "login"){
                this.spaceCode = obj.spaceCode;
                //登录时广播
                /*wss.broadcast(1, obj.spaceCode);*/
            }
        });
        // 退出聊天
        ws.on('close', function(close) {
            console.log(close);
            console.log(this.spaceCode+":droped!");
        });
    });
}
module.exports ={
    handle:handle,
    send:send
}
