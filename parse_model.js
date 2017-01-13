function parseRawModel(data) {
		
	function decodify(c) {
		if(c == undefined) return 0;
		if(c == '1' || c == '2') {
			return c.charCodeAt(0);
		}
		return 0;
	}
	
	var planes = data.split("\r\n\r\n");
	for(var i = 0; i < planes.length; i++) {
		planes[i] = planes[i].split("\r\n");
		for(var j = 0; j < planes[i].length; j++) {
			planes[i][j] = planes[i][j].split("");
			for(var k = 0; k < planes[i][j].length; k++) {
				planes[i][j][k] = decodify(planes[i][j][k]);
			}
		}
	}
	return planes;
}


function parseComponent(state) {
	
	var model_name = state.model_name;
	var data = state.data;
	
	var x_pivot = models[model_name].pivot.x;
	var y_pivot = models[model_name].pivot.y;	
	var z_pivot = models[model_name].pivot.z;

	
	if(!state.parsed) {
		state.planes = parseRawModel(data);
		state.parsed = true;
		
		// setup state for next part
		state.segments = [];
		state.i = 0;
		state.j = 0;
		state.k = 0;
		state.vertexPositions = [];
		state.vertexNormals = [];
		state.vertexColors = [];
		state.vertexCount = 0;
		state.vertexIndecis = [];
		state.indecisCount = 0;
		state.bounding_box = {"min":{"x":0,"y":0,"z":0},"max":{"x":0,"y":0,"z":0}};
		state.first_voxel = true;
		
		return false;
	}
	
	var planes = state.planes;
	
	var vertexPositions = state.vertexPositions;
	var vertexNormals = state.vertexNormals;
	var vertexColors = state.vertexColors;
	var vertexCount = state.vertexCount;
	var vertexIndecis = state.vertexIndecis;
	var indecisCount = state.indecisCount;
	
	var first_voxel = state.first_voxel;
	
	for(var i = 0; i < planes.length; i++) {
		for(var j = 0; j < planes[i].length; j++) {
			for(var k = 0; k < planes[i][j].length; k++) {
				if(planes[i][j][k] == 0) {
					continue;
				}
				var color = {"r":1.0,"g":1.0,"b":1.0};
				
				var x = j - x_pivot;
				var y = k - y_pivot;
				var z = i - z_pivot;
				
				if(first_voxel) {
					state.bounding_box.min.x = x;
					state.bounding_box.min.y = y;
					state.bounding_box.min.z = z;
					
					state.bounding_box.max.x = x;
					state.bounding_box.max.y = y;
					state.bounding_box.max.z = z;
					first_voxel = false;
				}
				
				if(state.bounding_box.min.x > x) state.bounding_box.min.x = x;
				if(state.bounding_box.min.y > y) state.bounding_box.min.y = y;
				if(state.bounding_box.min.z > z) state.bounding_box.min.z = z;
				
				if(state.bounding_box.max.x < x) state.bounding_box.max.x = x;
				if(state.bounding_box.max.y < y) state.bounding_box.max.y = y;
				if(state.bounding_box.max.z < z) state.bounding_box.max.z = z;
				
				
				
				var front_face = !(planes[i+1] && planes[i+1][j] && planes[i+1][j][k] > 0);
				var back_face = !(planes[i-1] && planes[i-1][j] && planes[i-1][j][k] > 0);
				var top_face = !(planes[i][j][k+1] > 0);
				var bottom_face = !(planes[i][j][k-1] > 0);
				var right_face = !(planes[i][j+1] && planes[i][j+1][k] > 0);
				var left_face = !(planes[i][j-1] && planes[i][j-1][k] > 0);
				/*
				var front_face = true;
				var back_face = true;
				var top_face = true;
				var bottom_face = true;
				var right_face = true;
				var left_face = true;
				*/
				
				var x_1 = 1.0+x;
				var y_1 = 1.0+y;
				var z_1 = 1.0+z;
				
				if(front_face) {
					state.vertexPositions.push(x, y, z_1, x_1, y, z_1, x_1, y_1, z_1, x, y_1, z_1);
					state.vertexNormals.push(0.0,  0.0,  1.0,  0.0,  0.0,  1.0,  0.0,  0.0,  1.0,  0.0,  0.0,  1.0);
				}
				if(back_face) {
					state.vertexPositions.push(x, y, z, x, y_1, z, x_1, y_1, z, x_1, y, z);
					state.vertexNormals.push(0.0,  0.0, -1.0,  0.0,  0.0, -1.0,  0.0,  0.0, -1.0,  0.0,  0.0, -1.0);
				}
				if(top_face) {
					state.vertexPositions.push(x, y_1, z, x, y_1, z_1, x_1, y_1, z_1, x_1, y_1, z);
					state.vertexNormals.push(0.0,  1.0,  0.0,  0.0,  1.0,  0.0,  0.0,  1.0,  0.0,  0.0,  1.0,  0.0);
				}
				if(bottom_face) {
					state.vertexPositions.push(x, y, z, x_1, y, z, x_1, y, z_1, x, y, z_1);
					state.vertexNormals.push(0.0, -1.0,  0.0,  0.0, -1.0,  0.0,  0.0, -1.0,  0.0,  0.0, -1.0,  0.0);
				}
				if(right_face) {
					state.vertexPositions.push(x_1, y, z, x_1, y_1, z, x_1, y_1, z_1, x_1, y, z_1);
					state.vertexNormals.push(1.0,  0.0,  0.0,  1.0,  0.0,  0.0,  1.0,  0.0,  0.0,  1.0,  0.0,  0.0);
				}
				if(left_face) {
					state.vertexPositions.push(x, y, z, x, y, z_1, x, y_1, z_1, x, y_1, z);
					state.vertexNormals.push(-1.0,  0.0,  0.0, -1.0,  0.0,  0.0, -1.0,  0.0,  0.0, -1.0,  0.0,  0.0);
				}
				
				var faces = [front_face, back_face, top_face, bottom_face, right_face, left_face];
				for(var index in faces) {
					if(faces[index]) {
						state.vertexIndecis.push(
							0 + state.vertexCount,
							1 + state.vertexCount,
							2 + state.vertexCount,
							0 + state.vertexCount,
							2 + state.vertexCount,
							3 + state.vertexCount
						);
						state.vertexColors.push(color.r,color.g,color.b,color.r,color.g,color.b,color.r,color.g,color.b,color.r,color.g,color.b);
						state.vertexCount += 4;
						state.indecisCount += 6;
					}
				}
				
				if(state.vertexCount + 24 >= 65536) {
					var new_segment = createNewSegment(
						state.vertexPositions,
						state.vertexNormals,
						state.vertexColors,
						state.vertexCount,
						state.vertexIndecis,
						state.indecisCount
					);
					state.segments.push(new_segment);
					
					state.vertexPositions = [];
					state.vertexNormals = [];
					state.vertexColors = [];
					state.vertexCount = 0;
					state.vertexIndecis = [];
					state.indecisCount = 0;
				}
			}
		}
	}
	
	var new_segment = createNewSegment(
		state.vertexPositions,
		state.vertexNormals,
		state.vertexColors,
		state.vertexCount,
		state.vertexIndecis,
		state.indecisCount
	);
	state.segments.push(new_segment);
	models[model_name].segments = state.segments;
	models[model_name].bounding_box = state.bounding_box;
	models[model_name].bounding_box.segment = createBoundingBoxSegment(state.bounding_box);
	models[model_name]['loaded'] = true;
	register_coroutine(load_models);
	return true;
}

function handleLoadedComponent(model_name, data) {
	var state = {};
	state.model_name = model_name;
	state.data = data;
	
	register_coroutine(parseComponent, state);
}


function loadComponent(model_name) {
	
	var this_model = models[model_name];
	
	if(this_model['basic']) {
		if(!this_model['loading'] && !this_model['loaded']) {
			this_model['loading'] = true;
			
			console.log("load " + model_name)
			
			var request = new XMLHttpRequest();
			request.open("GET", this_model['file_location']);
			request.onreadystatechange = function () {
				if (request.readyState == 4) {
					handleLoadedComponent(model_name, request.responseText);
				}
			}
			request.send();
		}
	} else {
		var all_loaded = true;
		for(var i = 0; i < this_model['pieces'].length; i++) {
			var piece = this_model['pieces'][i];
			
			if(!piece.transform) {
				var transform = mat4.create();
				mat4.identity(transform);
				mat4.translate(transform, transform, [piece['x'], piece['y'], piece['z']]);
				mat4.rotateZ(transform, transform, piece['yaw']);
				mat4.rotateX(transform, transform, piece['pitch']);
				mat4.rotateY(transform, transform, piece['roll']);
				
				piece.transform = transform;
			}
			
			var piece_loaded = loadComponent(piece['name']);
			all_loaded = all_loaded && piece_loaded;
		}
		this_model['loaded'] = all_loaded;
	}
	return this_model['loaded'];
}

function load_models() {
	var all_loaded = loadComponent("small room");
	console.log("Loading");
	if(all_loaded) {
		if(all_loaded) {
			document.getElementById('loading-notification').innerHTML = "";
		}
	}
	return true;
}