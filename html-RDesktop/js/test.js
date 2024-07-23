var lockReconnect1 = false;  // 避免ws重复连接
var ws1 = null;          // 判断当前浏览器是否支持WebSocket
var wsUrl1 = 'ws://192.168.2.210:15002';
window.html2canvas = function(node) {
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    ctx.drawImage(node, 0, 0);
    return canvas;
};
var dataURL = (function() {
    var canvas = document.getElementById('myCanvas');
    var ctx = canvas.getContext('2d');
    ctx.fillRect(10, 10, 100, 100); // Draw something to see the canvas in the page
    var dataURL = canvas.toDataURL();
    return dataURL;
})();

//document.body.appendChild(dataURL);
var img = new Image();
img.src = dataURL;
img.onload = function() {
    document.body.appendChild(img);
};
img.addEventListener('click', function(e) {
    var rect = this.getBoundingClientRect();
    var x = e.clientX - rect.left; //x position within the element.
    var y = e.clientY - rect.top;  //y position within the element.
    console.log("Mouse X position: " + x + " Mouse Y position: " + y);  // Print the coordinates to the console.
}, false);

//createWebSocket(wsUrl1);
//function createWebSocket(url) {
//  try {
//    if ('WebSocket' in window) {
//      ws1 = new WebSocket(url);
//    }
//    initEventHandle();
//  } catch(e) {
//    reconnect(url);
//    console.log(e);
//  }
//}
//
///**
// * 初始化事件处理
// */
//function initEventHandle() {
//  ws1.onclose = function () {
//    reconnect(wsUrl1);
//    console.log("WS1 连接关闭!" + new Date().toLocaleString());
//  };
//  ws1.onerror = function () {
//    reconnect(wsUrl1);
//    console.log("WS1 连接错误!");
//  };
//  ws1.onopen = function () {
//    console.log("WS1 连接成功!" + new Date().toLocaleString());
//    var desktop=document.getElementById("screenshot");
//            $(desktop).mousedown(function (e) {
//            console.log("mousedown:")
//            console.log(e)
//                   var x=e.offsetX-(e.screenX-e.offsetX)
//                   var y=e.offsetY+(e.screenY-e.offsetY)
//                   var objectJson={event:'mousedown',which:e.which,x:x,y:y};
//                   ws1.send(JSON.stringify(objectJson))
//            });
//
//            $(desktop).mouseup(function (e) {
//                   console.log("mouseup:")
//                   console.log(e)
//                   var x=e.offsetX-(e.screenX-e.offsetX)
//                    var y=e.offsetY+(e.screenY-e.offsetY)
//                   var objectJson={event:'mouseup',which:e.which,x:x,y:y};
//                   ws1.send(JSON.stringify(objectJson))
//            });
//  };
//}
//
//// 监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常。
//window.onbeforeunload = function() {
//  ws1.close();
//}
//function reconnect(url) {
//  if (lockReconnect1) return;
//  lockReconnect1 = true;
//  // 没连接上，会一直重连，设置延迟 2s 避免连接频繁
//  setTimeout(function () {
//    createWebSocket(url);
//    lockReconnect1 = false;
//  }, 2000);
//}



