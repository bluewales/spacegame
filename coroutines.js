

var coroutines = {"queue":[]};

function register_coroutine(callback, state) {
	console.log("register_coroutine");
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
		console.log("continue_coroutines " + (nowTime - startTime));
		
		
		var result = coroutines.queue[0].callback(coroutines.queue[0].state);
		if(result) { // the coroutine is complete
			coroutines.queue.splice(0,1);
		}
		nowTime = Date.now();
	}
}