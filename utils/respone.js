if (window.WebSocket) {
    console.log("支持");
}else {
    console.log("不支持");
}
let ws = new WebSocket('ws://localhost:3000');

ws.onopen = function(){  console.log("open");

    ws.send("hello");

};

ws.onmessage = function(evt){

    console.log(evt.data)

};

ws.onclose = function(evt){
    console.log("WebSocketClosed!");
};

ws.onerror = function(evt) {
    console.log("WebSocketError!");
};
