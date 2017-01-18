

var coroutines = {"queue":[]};

function register_coroutine(callback, state) {
	var coroutine = {"callback":callback, "state":state};
	coroutines.queue.push(coroutine);
}

function continue_coroutines(ms) {
	
	var startTime = Date.now();
	var nowTime = Date.now();
	
	while(nowTime - startTime < ms) {
	
		if(coroutines.queue.length == 0) {
			return;
		}
		
		var callback = coroutines.queue[0].callback;
		
		var result = callback(coroutines.queue[0].state);
		if(result) { // the coroutine is complete
			coroutines.queue.splice(0,1);
		}
		nowTime = Date.now();
		
		//console.log("continue_coroutines " + (nowTime - startTime));
	}
}
