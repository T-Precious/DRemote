var lockReconnect1 = false;  // 避免ws重复连接
var ws1 = null;          // 判断当前浏览器是否支持WebSocket
var wsUrl1 = 'ws://192.168.2.210:15005';
//var wsUrl1 = 'ws://localhost:5004';
//-10可用
var xOffset = 0;
var yOffset = 0;
var param=window.location.search;
  if(param){
     if (param.indexOf('?') != -1) {
        var str = param.substr(1)　 //去掉?号
        var strs = str.split('&');
        for (var i = 0; i < strs.length; i++) {
             if(strs[i].split('=')[0] == 'xOffset'){
                   xOffset = Number(strs[i].split('=')[1])
             }else if(strs[i].split('=')[0] == 'yOffset'){
                   yOffset = Number(strs[i].split('=')[1])
             }
        }
     }
  }
createWebSocket1(wsUrl1);
var width = 1920;
var height = 1080;
var dwidth=0;
var dheight=0;
window.onload = function() {
    var iwidth=window.innerWidth
    var iheight=window.innerHeight
    console.log('浏览器内部宽度: ' + iwidth);
    console.log('浏览器内部高度: ' + iheight);
    console.log('Screen X: ' + window.screenX);
    console.log('Screen Y: ' + window.screenY);
    console.log('Outer width: ' + window.outerWidth);
    console.log('Outer height: ' + window.outerHeight);
    dwidth=width-iwidth
    console.log("相差宽度: " + dwidth);
    dheight=height-iheight
    console.log("相差高度: " + dheight);
};
/**
 * 创建 WS 实例
 * @param {string} url ws的URL
 */
function createWebSocket1(url) {
  try {
    if ('WebSocket' in window) {
      ws1 = new WebSocket(url);
    }
    initEventHandle1();
  } catch(e) {
    reconnect1(url);
    console.log(e);
  }
}

/**
 * 初始化事件处理
 */
function initEventHandle1() {
  ws1.onclose = function () {
    console.log("WS1关闭的状态");
    console.log(ws1);
    reconnect1(wsUrl1);
    console.log("WS1 连接关闭!正在重新连接" + new Date().toLocaleString());
  };
  ws1.onerror = function () {
    console.log("WS1error的状态");
    console.log(ws1);
    reconnect1(wsUrl1);
    console.log("WS1 连接错误!正在重新连接");
  };
  ws1.onmessage = function (event) {
    //如果获取到消息，心跳检测重置
    //拿到任何消息都说明当前连接是正常的
//    heartCheck1.reset().start();
    document.getElementById('screenshot').src =  event.data;
  };
  ws1.onopen = function () {
    console.log("WS1open的状态");
    console.log(ws1);
    //心跳检测重置
//    heartCheck1.reset().start();
    console.log("WS1 连接成功!" + new Date().toLocaleString());
    var desktop=document.getElementById("screenshot");
             var scrollFunc = function (e) {
                e = e || window.event;
                console.log("滚动")
                console.log(e)
                 var x=0;
                  var y=0;
//                  if(dwidth > 0){
//                     x=e.offsetX+dwidth/2
//                  }else{
                     x=e.offsetX
//                  }
//                    y=e.offsetY-dheight/2+scale
                    y=e.offsetY
//                   var y=e.offsetY-(e.screenY-e.offsetY)/2-scale
                   var objectJson={type:'mouse',event:'mousewheel',wheelDelta:e.wheelDelta,x:x,y:y};
                   ws1.send(JSON.stringify(objectJson))
            }
            window.onmousewheel = document.onmousewheel = scrollFunc;
//           $(desktop).mousemove(function (e) {
//               var x=e.offsetX-(e.screenY-e.offsetY)
//               var y=e.offsetY+(e.screenY-e.offsetY)
//               var objectJson={event:'mousemove',x:x,y:y};
//              ws1.send(JSON.stringify(objectJson))
//           });
            $(window).keydown(function(e){
                   var objectJson = null;
                   if(e.ctrlKey && e.key == 'c'){
                      objectJson={type:'keyboard',event:'qrouopKey',key:e.key};
                   }else if(e.ctrlKey && e.key == 'v'){
                      objectJson={type:'keyboard',event:'qrouopKey',key:e.key};
                   }else if(e.ctrlKey && e.keyCode == 32){
                      objectJson={type:'keyboard',event:'qrouopKey',key:e.key};
                   }else if(e.ctrlKey && e.key == 's'){
                      objectJson={type:'keyboard',event:'qrouopKey',key:e.key};
                   }else{
                      objectJson={type:'keyboard',event:'keydown',key:e.key};
                   }
                   ws1.send(JSON.stringify(objectJson))
            });
            $(window).keyup(function(e){
            console.log("keyup")
            console.log(e)
                   var objectJson={type:'keyboard',event:'keyup',key:e.key};
                   ws1.send(JSON.stringify(objectJson))
            });
            $(desktop).mousedown(function (e) {
                console.log(e)
                  var x=0;
                  var y=0;
//                  if(dwidth > 0){
//                     x=e.offsetX+dwidth/2
//                  }else{
                     x=e.clientX+xOffset
//                  }
//                    y=e.offsetY-dheight/2+scale
                    y=e.clientY+yOffset
//                   var y=e.offsetY-(e.screenY-e.offsetY)/2-scale
                   var objectJson={type:'mouse',event:'mousedown',which:e.which,x:x,y:y};
                   ws1.send(JSON.stringify(objectJson))
            });
            $(desktop).mouseup(function (e) {
                 console.log(e)
                  var x=0;
                  var y=0;
//                  if(dwidth > 0){
//                     x=e.offsetX+dwidth/2
//                  }else{
                     x=e.clientX+xOffset
//                  }
//                   y=e.offsetY-dheight/2+scale
                   y=e.clientY+yOffset
//                    var y=e.offsetY-(e.screenY-e.offsetY)/2-scale
                   var objectJson={type:'mouse',event:'mouseup',which:e.which,x:x,y:y};
                   ws1.send(JSON.stringify(objectJson))
            });

//            $(desktop).click(function (e) {
//                 console.log("click:"+event)
//                 console.log(event)
//                 var objectJson={event:'mouseClick',x:e.clientX,y:e.clientY};
//                 ws1.send(JSON.stringify(objectJson))
//            });
//            $(desktop).dblclick(function (e) {
//                console.log("dblclick:"+event)
//                console.log(event)
//                var objectJson={event:'mousedblclick',button:e.button};
//                ws1.send(JSON.stringify(objectJson))
//            });
  };
}

// 监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常。
window.onbeforeunload = function() {
  ws1.close();
}

/**
 * 重连
 * @param {string} url ws的URL
 * @returns null
 */
function reconnect1(url) {
  if (lockReconnect1) return;
  lockReconnect1 = true;
  //OPEN：1，CONNECTING：0，CLOSING：2，CLOSED：3
//  if (ws1 && (ws1.readyState == WebSocket.OPEN || ws1.readyState == WebSocket.CONNECTING || ws1.readyState == WebSocket.CLOSING)) {
//      console.log("WS1的状态" + ws1.readyState);
//      console.log(ws1);
//      ws1.close();
//  }
  console.log("WS1正在重新连接" + new Date().toLocaleString());
  // 没连接上，会一直重连，设置延迟 2s 避免连接频繁
  setTimeout(function () {
    createWebSocket1(url);
    lockReconnect1 = false;
  }, 2000);
}

// 心跳检测
var heartCheck1 = {
  timeout: 3000,
  timeoutObj: null,
  serverTimeoutObj: null,
  reset: function() {
    clearTimeout(this.timeoutObj);
    clearTimeout(this.serverTimeoutObj);
    return this;
  },
  start: function() {
    var self = this;
    this.timeoutObj = setTimeout(function() {
      //这里发送一个心跳，后端收到后，返回一个心跳消息，
      //onmessage拿到返回的心跳就说明连接正常
      var objectJson={type:'heartbeat',event:'heartbeat'};
       ws1.send(JSON.stringify(objectJson))
//      console.log("ping!")
      //如果超过一定时间还没重置，说明后端主动断开了
      self.serverTimeoutObj = setTimeout(function() {
        console.log("onclose会执行reconnect:" + new Date().toLocaleString())
        //如果onclose会执行reconnect，我们执行ws.close()就行了.如果直接执行reconnect 会触发onclose导致重连两次
        ws1.close();
      }, self.timeout)
    }, this.timeout)
  }
}
