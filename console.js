/*******************************************************************************
* console.js - 兼容IE的模拟控制台
*
* @author Adam 
* @version 1.0.0 
*******************************************************************************/
(function(){
document.onselect = false;
function bind(elm,action,listener){
	if (window.attachEvent) {
        elm.attachEvent("on" + action, listener);
    }
    else {
        elm.addEventListener(action, listener, false); 
    }
}
/* 单例模式 */
function vConsole(config){

    if( typeof vConsole.unique !== 'undefined' ){
        return vConsole.unique; 
    }
    vConsole.unique = this;
    var commandRecord = {
    	commands : [], //存放命令的记录
    	index : 0
    } ;
    var that = this;
    var consoleBox = document.createElement("div");
    var titleBar = document.createElement("div");
    	titleBar.select = false;
    var messageBox = document.createElement("div");
    var commandBox = document.createElement("div");
    var commandInput = document.createElement("input");
    	commandInput.type = "text";
    	commandInput.index = 0;
    var runButton = document.createElement("input");
    	runButton.type = "button";
  
    function ajax (config){
    	config = config || {};
    	config.method = config.method || "get";
    	config.url = config.url || "console.css";
    	config.callback = config.callback || function(){};
    	var xhr;
        if(window.ActiveXObject){ //如果是IE浏览器  
            xhr = new ActiveXObject("Microsoft.XMLHTTP");  
        }else if(window.XMLHttpRequest){ //非IE浏览器  
           	xhr = new XMLHttpRequest();  
        }  
		xhr.open(config.method, config.url);
		xhr.send();
		xhr.onreadystatechange = function(){
			if(xhr.readyState == 4) {
			    if(xhr.status == 200) {
			    	config.callback(xhr.responseText);
				}
			}
		}
    }
 
    function init(){
  
		ajax({
			callback : function(res){
				try{
    				var style = document.createElement("style"),
						head = document.getElementsByTagName("head")[0];
						style.innerHTML = res;
						head.appendChild(style);
				}
				catch(e){
					//兼容IE
					document.createStyleSheet("javascript:'" + res + "'");
				}
				//document.body.innerHTML = "<div class = 'consoleBox'>12312</div>"
				addChild();
			}
		});
		function addChild(){
			consoleBox.className = "consoleBox" ;
	    	messageBox.className = "messageBox" ;
	    	titleBar.className = "titleBar";
	    	titleBar.innerHTML = "控制台<div style='position:absolute;right:0px;top:0px;'><input type = 'button' value = '关闭' onclick ='console.close()'/></div>";
	    	commandInput.className = "commandInput";

	    	document.body.appendChild(consoleBox);
	    	consoleBox.appendChild(titleBar);
	    	titleBarDrag();
	    	consoleBox.appendChild(messageBox);
	    	
    	}
    	function titleBarDrag(){

    		var select = false,
    			startX,
    			startY,
    			left,
    			top;
    		bind(titleBar,'mousedown',function(e){
	    		e = e || window.event;
	    		select = true;
	    		titleBar.style.cursor = "pointer";
	    		startX = e.clientX;
	    		startY = e.clientY;
	    		left = consoleBox.offsetLeft;
	    		top  =consoleBox.offsetTop;
	    	});
	    	bind(document,"mousemove",function(e){
	    		if(!select)
	    			return ;
	    		e = e || window.event;
	    		consoleBox.style.left = left + e.clientX - startX + "px";
	    		consoleBox.style.top = top + e.clientY - startY + "px";
	    	});
	    	bind(titleBar,"mouseup",function(e){
	    		titleBar.style.cursor = "";
	    		select = false;

	    	});
    	}
    }
    
    function showInnerObject(obj){  //
    	var message = "";
    	for(var i in obj){
    		message +=  ""
    		+ "<div class = 'objrows'><span class = 'key'>" + i + "</span>" 
    		+ ":"
    		+ typeHandler(obj[i])
    		+ "</div>" ;
    	}
    	message = message.substr(0,message.length-1);
    	return message;
    }
   
    function typeHandler(obj,type){
    
    	var handler = {
    		'object':function(obj){
    			//Aarry Date 这些都属于object
    			var objstring = "<span class = 'obj'>Object "
    			 + showInnerObject(obj) 
    			 + " }</span>";
    			 return objstring;
    		},
    		'function':function(obj){
    			return obj = "<span class = 'function' >" 
    					   + obj.toString()
    					   + "</span>";
    		},
    		'string':function(obj){
    			var str = '<span class = "string">';
    			str +=  '"' + obj + '"';
    			str += "</span>";
    			return str;
    		},
    		'number':function(obj){
    			var num = '<span class = "num">';
    			num +=  obj;
    			num += "</span>";
    			return num;
    		},
    		'boolean':function(obj){
    			var boolean = '<span class = "boolean">';
    			boolean +=  obj;
    			boolean += "</span>";
    			return boolean;
    		},
			'undefined':function(obj){
				var undefined = '<span class = "undefined">undefined</span>';
				return undefined;
			}

    	};
    	var type = typeof obj;
    	return handler[type](obj);
    }
    this.log =  function(msg){
    	msg = msg || "";
    	messageBox.innerHTML += msg+"<br/>"; 
    	messageBox.scrollTop = messageBox.scrollHeight;
    }
    this.dir = function(){

    }
    //测试运行时间
    var timeRecord = [];
    this.time = function(timename){
    	timeRecord[timename] = {};
    	timeRecord[timename] = new Date();
    }
    this.timeEnd = function(timename){
    	var nowtime = new Date();
    	var timespan = nowtime.getTime() - timeRecord[timename].getTime();
    	this.log(timespan.toString() + "ms");
    	delete timeRecord[timename]; //清空所占内存
    }
    //查看函数调用 
    this.trace = function(){
    	 alert(arguments.callee);
    	 console.log(this.trace.caller);
    }
   	//测试表达式真假
    this.assert = function(exp){ 

    }
    this.clear = function(){
    	messageBox.innerHTML = "";
    }
    this.close = function(){
    	consoleBox.parentNode.removeChild(consoleBox);
    	console = null;
    }

    init();
}
console = new vConsole();
})();