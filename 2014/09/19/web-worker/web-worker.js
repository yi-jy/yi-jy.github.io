
//importScripts("fn.js");

function cal(a){
	for(var i = 0 ; i < 10000 ; i++ ){
		a += "<div>"+i+"</div>";
	} 
	return a;
}

self.addEventListener("message",function(e){
	var resultStr = cal(e.data);
	self.postMessage(resultStr);
	self.close();
},false);