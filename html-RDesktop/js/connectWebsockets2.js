var lockReconnect1 = false;  // 避免ws重复连接
var executeVariable = false;//执行变量
var clickdbable=false;
var ws1 = null;          // 判断当前浏览器是否支持WebSocket
if(ipAddress !=null){
    var wsUrl1 = 'ws://'+ipAddress+':15002';
//    var wsUrl1 = 'ws://localhost:5004';
    var keyarry=[];
    var mouseKeyarray=[];
    var mouseKeyShowArray=[];
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
    var imgWidth=1280;
    var imgheight=1024;
    var ratio=imgWidth/imgheight;
    console.log('比列为：' + ratio);
    var newHeight=0;
    var newWidth=0;
    var offsetNum=10;
    var widthRatio=0;
    var heightRatio=0;
    var width=window.innerWidth;
    var height = window.innerHeight;
    console.log('窗口宽度：' + width + 'px');
    console.log('窗口高度：' + height + 'px');
    var desktop=document.getElementById("screenshot");
    var leftDIV=document.getElementById("leftDIV");
    var rightDIV=document.getElementById("rightDIV");
    if(imgheight > height){
         newHeight=height-offsetNum;
         leftDIV.style.height= newHeight+'px';
         var num=imgheight-newHeight;
         newWidth=(imgWidth-num)*ratio;
         leftDIV.style.width= newWidth+'px';
         console.log('变化后的宽：' + newWidth + 'px');
         console.log('变化后的高：' + newHeight + 'px');
         widthRatio=imgWidth/newWidth;
         heightRatio=imgheight/newHeight;
         var rightwidth=width-newWidth;
         rightDIV.style.width= rightwidth+'px';
         rightDIV.style.height= newHeight+'px';
    }
    function clearEvent(){
       if(!executeVariable){
           mouseKeyarray=[];
           $("#contDIV p").remove();
           console.log(mouseKeyarray);
       }else{
          alert("正在执行操作，请勿进行清除操作");
       }
    }
    function commitExecution(){
      if(!executeVariable){
          executeVariable=true;
          var inum=0;
          if(mouseKeyarray.length > 0){
              ws1.send(JSON.stringify({type:'keyboard',event:'windowsD',key:'d'}));
              var intervalId=setInterval(()=>{
                 var obj=mouseKeyarray[inum];
                 if(obj.event=='mousedown'){
                     console.log(mouseKeyarray[inum+4]);
                     if(typeof mouseKeyarray[inum+4] !== 'undefined'){
                        if(mouseKeyarray[inum+4].event=='mousedblclick'){
                          ws1.send(JSON.stringify(mouseKeyarray[inum+4]))
                           mouseKeyarray.splice(inum,5);
                        }else{
                           ws1.send(JSON.stringify(mouseKeyarray[inum]))
                           mouseKeyarray.splice(inum,1);
                        }
                    }else{
                     ws1.send(JSON.stringify(mouseKeyarray[inum]))
                     mouseKeyarray.splice(inum,1);
                    }
                 }else if(obj.event=='keydown'){
                      if(obj.key=='Enter' || obj.key=='Tab'){
                           ws1.send(JSON.stringify(mouseKeyarray[inum]))
                           mouseKeyarray.splice(inum,1);
                      }else{
                        if(obj.key.match(/[a-zA-Z0-9]/)){
                            var keydownKeyups=[];
                            var akeyi=0;
                            try{
                                mouseKeyarray.forEach(function(item,index){
                                    if(item.type=='keyboard'){
                                          keydownKeyups.push(item);
                                         if(item.key=='Enter' && index > 0){
                                            akeyi=index;
                                            throw new Error('LoopInterrupt');
                                         }else if(index==20){
                                            akeyi=index;
                                            throw new Error('LoopInterrupt');
                                         }
                                    }else{
                                      throw new Error('LoopInterrupt');
                                    }
                                });
                            }catch(e){
                                if (e.message !== "LoopInterrupt") throw e
                            }
                            if(keydownKeyups.length > 0){
                              ws1.send(JSON.stringify({type:'keysArray',event:keydownKeyups}));
                              mouseKeyarray.splice(inum,akeyi+1);
                            }else{
                              ws1.send(JSON.stringify(mouseKeyarray[inum]))
                              mouseKeyarray.splice(inum,1);
                            }
                        }else{
                           ws1.send(JSON.stringify(mouseKeyarray[inum]))
                           mouseKeyarray.splice(inum,1);
                        }
                      }
                 }else{
                     ws1.send(JSON.stringify(mouseKeyarray[inum]))
                     mouseKeyarray.splice(inum,1);
                 }
                 console.log(mouseKeyarray);
                 if(mouseKeyarray.length == 0){
                   clearInterval(intervalId);
                   setTimeout(function () {
                       executeVariable=false;
                       $("#contDIV p").remove();
                   },3000);
                 }
              },2000)
          }else{
              alert("你还未执行任何操作");
          }
      }else{
        alert("正在执行操作，请勿反复操作");
      }
    }
    // 连接ws btscrollTop+etscrollTop
    createWebSocket1(wsUrl1);
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
        console.log(event.data)
    //    heartCheck1.reset().start();
      };
      ws1.onopen = function () {
        console.log("WS1open的状态");
        console.log(ws1);
        //心跳检测重置
    //    heartCheck1.reset().start();
        console.log("WS1 连接成功!" + new Date().toLocaleString());
                 var scrollFunc = function (e) {
                     if(!executeVariable){
                        e = e || window.event;
                        console.log("滚动")
                        console.log(e)
                         var x=0;
                          var y=0;
                             x=e.offsetX
                            y=e.offsetY
                           var objectJson={type:'mouse',event:'mousewheel',wheelDelta:e.wheelDelta,x:x,y:y};
                           ws1.send(JSON.stringify(objectJson))
                           mouseKeyarray.push(objectJson);
                           $("#contDIV").append("<p>鼠标滚动：滚动值："+e.wheelDelta+",滚动终点坐标：("+x+","+y+")</p>");
                      }else{
                        alert("正在执行自动操作，请勿操作桌面");
                      }
                }
//                window.onmousewheel = document.onmousewheel = scrollFunc;
                 desktop.onmousewheel = scrollFunc;
//               $(desktop).mousemove(function (e) {
////                   ctx.beginPath();
////                   ctx.arc(e.clientX, e.clientY, 10, 0, Math.PI*2);  //画一个圆点，代表鼠标位置
////                   ctx.fillStyle = 'red';
////                   ctx.fill();
//                    // 去除滚动条的影响
//                       var scrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft;
//                       var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
////                   var x=e.offsetX +window.screenX + xOffset;
//                     var x=e.clientX+scrollLeft;
////                   var y=e.offsetY +window.screenY + yOffset;
//                     var y=e.clientY+scrollTop;
//                   var objectJson={type:'mouse',event:'mousemove',x:x,y:y};
//                  ws1.send(JSON.stringify(objectJson))
//               });
//                $(window).keypress(function(e){
//                    if(!executeVariable){
//                      keyarry.push("keypress")
//                    }else{
//                       alert("正在执行自动操作，请勿操作桌面");
//                    }
//                       console.log("keypress")
////                       console.log(e)
//                       var objectJson = null;
//                       objectJson={type:'keyboard',event:'keypress',key:e.key};
//                       ws1.send(JSON.stringify(objectJson))
//                       keyarry=[];
//                });
                $(window).keydown(function(e){
//                       if(!executeVariable){
//                           keyarry.push("keydown")
//                       }else{
//                           alert("正在执行自动操作，请勿操作桌面");
//                       }
                       if(!executeVariable){
                          var objectJson={type:'keyboard',event:'keydown',key:e.key};
                          mouseKeyarray.push(objectJson);
                          mouseKeyShowArray.push(e.key);
                           ws1.send(JSON.stringify(objectJson))
//                           $("#contDIV").append("<p>键盘事件：keydown,+key:"+e.key+"</p>");
                       }else{
                           alert("正在执行自动操作，请勿操作桌面");
                       }
//                       if(keyarry.includes("keypress")){
//                           console.log("进入keydown")
//                           var objectJson2={type:'keyboard',event:'keydown',key:e.key};
//                           ws1.send(JSON.stringify(objectJson2));
//                           keyarry=[];
//                       }
//                       console.log(e)
//                       var objectJson = null;
//                       if(e.ctrlKey && e.key == 'c'){
//                          objectJson={type:'keyboard',event:'qrouopKey',key:e.key};
//                       }else if(e.ctrlKey && e.key == 'v'){
//                          objectJson={type:'keyboard',event:'qrouopKey',key:e.key};
//                       }else if(e.ctrlKey && e.keyCode == 32){
//                          objectJson={type:'keyboard',event:'qrouopKey',key:e.key};
//                       }else if(e.ctrlKey && e.key == 's'){
//                          objectJson={type:'keyboard',event:'qrouopKey',key:e.key};
//                       }else{
//                          objectJson={type:'keyboard',event:'keydown',key:e.key};
//                       }
//                       ws1.send(JSON.stringify(objectJson))
                });
                $(window).keyup(function(e){
                    if(!executeVariable){
//                        keyarry.push("keyup")
//                        if(keyarry.length > 0){
//                              if(keyarry.includes("keypress")){
//                                var objectJson1={type:'keyboard',event:'keypress',key:e.key};
//                                mouseKeyarray.push(objectJson1);
//                                 ws1.send(JSON.stringify(objectJson1));
//                                 $("#contDIV").append("<p>键盘事件：keypress,+key:"+e.key+"</p>");
//                                 keyarry=[];
//                              }else{
//                                var objectJson2={type:'keyboard',event:'keydown',key:e.key};
//                                mouseKeyarray.push(objectJson2);
//                                ws1.send(JSON.stringify(objectJson2));
//                                $("#contDIV").append("<p>键盘事件：keydown,+key:"+e.key+"</p>");
                                var objectJson3={type:'keyboard',event:'keyup',key:e.key};
                                mouseKeyarray.push(objectJson3);
                                ws1.send(JSON.stringify(objectJson3));
//                                $("#contDIV").append("<p>键盘事件：keyup,+key:"+e.key+"</p>");
//                                $("#contDIV").append("<p>键盘事件：keypress,+key:"+e.key+"</p>");
                                var ainem=0;
                                if(mouseKeyShowArray.length>20){
                                    ainem=20;
                                    var kkees="";
                                       for(var i=0;i<ainem+1;i++){
                                               kkees+=mouseKeyShowArray[i];
                                       }
                                       $("#contDIV").append("<p>键盘事件：keypress,key:"+kkees+"</p>");
                                        mouseKeyShowArray.splice(0,ainem+1);
                                }else{
                                    mouseKeyShowArray.forEach(function(item,index){
                                         if(item=='Enter' && index > 0){
                                                ainem=index;
                                         }else if(item=='Tab' && index > 0){
                                                ainem=index;
                                         }else if(item=='Shift' && index > 0){
                                                ainem=index;
                                         }
                                    });
                                    if(ainem > 0){
                                       var kkees="";
                                       for(var i=0;i<ainem;i++){
                                               kkees+=mouseKeyShowArray[i];
                                       }
                                       $("#contDIV").append("<p>键盘事件：keypress,key:"+kkees+"</p>");
                                       $("#contDIV").append("<p>键盘事件：keypress,key:"+mouseKeyShowArray[ainem]+"</p>");
                                        mouseKeyShowArray.splice(0,ainem+1);
                                    }else if(mouseKeyShowArray[ainem]=='Enter' || mouseKeyShowArray[ainem]=='Tab' || mouseKeyShowArray[ainem]=='Shift'){
                                       $("#contDIV").append("<p>键盘事件：keypress,key:"+mouseKeyShowArray[ainem]+"</p>");
                                       mouseKeyShowArray.splice(0,ainem+1);
                                    }
                                }
//                                keyarry=[];
//                              }
//                        }else{
//                           console.log(keyarry)
//                        }
                    }else{
                       alert("正在执行自动操作，请勿操作桌面");
                    }
                });
                $(desktop).mousedown(function (e) {
                   if(!executeVariable){
                    console.log(e)
                    console.log("mousedown:"+e.which)
                        // 去除滚动条的影响
                       var scrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft;
                       var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
                          var x=e.clientX+scrollLeft;
                          var y=e.clientY+scrollTop;
                            if(widthRatio!=0 && heightRatio!=0){
                                 x=x*widthRatio;
                                 y=y*heightRatio;
                            }
//                            var objectJson1={type:'mouse',event:'mousemove',x:x,y:y};
//                            ws1.send(JSON.stringify(objectJson1))
                           var objectJson={type:'mouse',event:'mousedown',which:e.which,x:x,y:y};
                            mouseKeyarray.push(objectJson);
                           ws1.send(JSON.stringify(objectJson))
//                           $("#contDIV").append("<p>鼠标单击：mousedown,坐标：("+x+","+y+")</p>");
                    }else{
                       alert("正在执行自动操作，请勿操作桌面");
                    }
                });
                $(desktop).mouseup(function (e) {
                    if(!executeVariable){
                     console.log(e)
                      console.log("mouseup:"+e.which)
                         // 去除滚动条的影响
                       var scrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft;
                       var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
                          var x=e.clientX+scrollLeft;
                          var y=e.clientY+scrollTop;
                           if(widthRatio!=0 && heightRatio!=0){
                             x=x*widthRatio;
                             y=y*heightRatio;
                           }
//                            var objectJson1={type:'mouse',event:'mousemove',x:x,y:y};
//                            ws1.send(JSON.stringify(objectJson1))
                           var objectJson={type:'mouse',event:'mouseup',which:e.which,x:x,y:y};
                            mouseKeyarray.push(objectJson);
                           ws1.send(JSON.stringify(objectJson))
//                           $("#contDIV").append("<p>鼠标单击：mouseup,坐标：("+x+","+y+")</p>");
                           setTimeout(function () {
                               if(!clickdbable){
                                 $("#contDIV").append("<p>鼠标单击：mouseClick,坐标：("+x+","+y+")</p>");
                               }
                           },1000);
                     }else{
                        alert("正在执行自动操作，请勿操作桌面");
                     }
                });

//                $(desktop).click(function (e) {
//                   if(!executeVariable){
//                         // 去除滚动条的影响
//                       var scrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft;
//                       var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
//                       var x=e.clientX+scrollLeft;
//                       var y=e.clientY+scrollTop;
//                       if(widthRatio!=0 && heightRatio!=0){
//                         x=x*widthRatio;
//                         y=y*heightRatio;
//                       }
//    //                     var objectJson={type:'mouse',event:'mouseClick',x:x,y:y};
////                        var objectJson1={type:'mouse',event:'mousemove',x:x,y:y};
////                        ws1.send(JSON.stringify(objectJson1))
//                        var objectJson={type:'mouse',event:'mouseLeftClick',x:x,y:y};
//                        mouseKeyarray.push(objectJson);
//                         ws1.send(JSON.stringify(objectJson))
//                         console.log("click事件");
//                          console.log(e);
//                         $("#contDIV").append("<p>鼠标左键单击：mouseLeftClick,坐标：("+x+","+y+")</p>");
//                   }else{
//                      alert("正在执行自动操作，请勿操作桌面");
//                   }
//                });
//                $(desktop).contextmenu(function (e) {
//                 e.preventDefault();  // 阻止默认的右键菜单
//                 if(!executeVariable){
//                         // 去除滚动条的影响
//                       var scrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft;
//                       var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
//                       var x=e.clientX+scrollLeft;
//    //                   x=x*widthRatio;
//                       var y=e.clientY+scrollTop;
//    //                    y=y*heightRatio;
//                       if(widthRatio!=0 && heightRatio!=0){
//                         x=x*widthRatio;
//                         y=y*heightRatio;
//                       }
//                        var objectJson={type:'mouse',event:'mouseRightClick',x:x,y:y};
//                        mouseKeyarray.push(objectJson);
//                         console.log(mouseKeyarray);
//                         ws1.send(JSON.stringify(objectJson))
//                          $("#contDIV").append("<p>鼠标右键单击：mouseRightClick,坐标：("+x+","+y+")</p>");
//                  }else{
//                     alert("正在执行自动操作，请勿操作桌面");
//                  }
//                });
                $(desktop).dblclick(function (e) {
                    if(!executeVariable){
                        clickdbable=true;
                        // 去除滚动条的影响
                       var scrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft;
                       var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
                       var x=e.clientX+scrollLeft;
    //                   x=x*widthRatio;
                       var y=e.clientY+scrollTop;
    //                   y=y*heightRatio;
                       if(widthRatio!=0 && heightRatio!=0){
                         x=x*widthRatio;
                         y=y*heightRatio;
                       }
                        var objectJson={type:'mouse',event:'mousedblclick',x:x,y:y};
                        mouseKeyarray.push(objectJson);
                        ws1.send(JSON.stringify(objectJson))
                         $("#contDIV").append("<p>鼠标双击：mousedblclick,坐标：("+x+","+y+")</p>");
                         setTimeout(function () {
                             clickdbable=false;
                         },2000);
                    }else{
                       alert("正在执行自动操作，请勿操作桌面");
                    }
                });
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
}else{
  console.log("ipAddress地址："+ipAddress);
}