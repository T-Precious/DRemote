var lockReconnect = false;  // 避免ws重复连接
var ws = null;          // 判断当前浏览器是否支持WebSocket
//var host=window.location.host;
var host="192.168.2.210:8512";
var ipAddress = null;
console.log("host地址："+host);
if(host){
    ipAddress=host.split(':')[0];
}else{
  alert("未获取到host地址");
}
var wsUrl = null;
if(ipAddress !=null){
    wsUrl = 'ws://'+ipAddress+':15001';
}else{
   console.log("ipAddress未能获取到");
}


//var wsUrl = 'ws://localhost:5003';
//var canvas = document.getElementById("screenshot");
//var ctx = canvas.getContext("2d");
//var img = new Image();
if(wsUrl !=null){
    // 连接ws
    createWebSocket(wsUrl);

    /**
     * 创建 WS 实例
     * @param {string} url ws的URL
     */
    function createWebSocket(url) {
      try {
        if ('WebSocket' in window) {
          ws = new WebSocket(url);
        }
        initEventHandle();
      } catch(e) {
        reconnect(url);
        console.log(e);
      }
    }

    /**
     * 初始化事件处理
     */
    function initEventHandle() {
      ws.onclose = function (event) {
        if (event.wasClean) {
            console.log("Clean close, code: " + event.code + " reason: " + event.reason);
        } else {
            console.log("Unclean close, code: " + event.code + " reason: " + event.reason);
        }
        reconnect(wsUrl);
        console.log("WS 连接关闭!" + new Date().toLocaleString());
      };
      ws.onerror = function () {
        reconnect(wsUrl);
        console.log("WS 连接错误!");
      };
      ws.onopen = function () {
        //心跳检测重置
        heartCheck.reset().start();
        console.log("WS 连接成功!" + new Date().toLocaleString());
      };
      ws.onmessage = function (event) {
        //如果获取到消息，心跳检测重置
        //拿到任何消息都说明当前连接是正常的
        heartCheck.reset().start();
          // 收到截图文件后更新图像的src属性来显示截图
        document.getElementById('screenshot').src =  event.data;
//            var widthImg=document.getElementById('screenshot').clientWidth;
//            var heightImg = document.getElementById('screenshot').clientHeight;
//            console.log('图片宽度：' + widthImg + 'px');
//            console.log('图片高度：' + heightImg + 'px');
    //    img.src = event.data;
    //     img.onload = function() {
    //    canvas.width = img.width;
    //    canvas.height = img.height;
    //    ctx.drawImage(img, 0, 0, img.width, img.height);
    //    }
      };
    }

    // 监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常。
    window.onbeforeunload = function() {
      ws.close();
    }

    /**
     * 重连
     * @param {string} url ws的URL
     * @returns null
     */
    function reconnect(url) {
      if (lockReconnect) return;
      lockReconnect = true;
      // 没连接上，会一直重连，设置延迟 2s 避免连接频繁
      setTimeout(function () {
        createWebSocket(url);
        lockReconnect = false;
      }, 2000);
    }

    // 心跳检测
    var heartCheck = {
      timeout: 1000,
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
          ws.send("heartbeat");
    //      console.log("ping!")
          //如果超过一定时间还没重置，说明后端主动断开了
          self.serverTimeoutObj = setTimeout(function() {
            console.log("onclose会执行reconnect:" + new Date().toLocaleString())
            //如果onclose会执行reconnect，我们执行ws.close()就行了.如果直接执行reconnect 会触发onclose导致重连两次
            ws.close();
          }, self.timeout)
        }, this.timeout)
      }
    }
}else{
  alert("未能正确获取到websocket连接地址！");
}
