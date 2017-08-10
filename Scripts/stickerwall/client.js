        var oUl=document.getElementById('content');
		var oConnect=document.getElementById('connect');
		var oSend=document.getElementById('send');
		var oInput=document.getElementById('message');
		var ws=null;
		oConnect.onclick=function(){
			ws=new WebSocket('ws://localhost:5000');
			 ws.onopen=function(){
				 oUl.innerHTML+="<li>我已经开始连上了</li>";
			 }
			ws.onmessage=function(evt){
				oUl.innerHTML+="<li>"+evt.data+"</li>";
			}
			ws.onclose=function(){
				oUl.innerHTML+="<li>我已经关闭了</li>";
			};
			ws.onerror=function(evt){
				oUl.innerHTML+="<li>"+evt.data+"</li>";

			};
		};
		oSend.onclick=function(){
			if(ws){
				ws.send(oInput.value);
			}
    }