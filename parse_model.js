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

function buildSegments(state) {
	
	var model_name = state.model_name;
	
	var x_pivot = models[model_name].pivot[0];
	var y_pivot = models[model_name].pivot[1];	
	var z_pivot = models[model_name].pivot[2];
	
	var planes = state.planes;
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
				
				var x_1 = 1.0+x;
				var y_1 = 1.0+y;
				var z_1 = 1.0+z;
				
				if(first_voxel) {
					state.boundingBox.min[0] = x;
					state.boundingBox.min[1] = y;
					state.boundingBox.min[2] = z;
					
					state.boundingBox.max[0] = x_1;
					state.boundingBox.max[1] = y_1;
					state.boundingBox.max[2] = z_1;
					first_voxel = false;
				}
				
				
				if(state.boundingBox.min[0] > x) state.boundingBox.min[0] = x;
				if(state.boundingBox.min[1] > y) state.boundingBox.min[1] = y;
				if(state.boundingBox.min[2] > z) state.boundingBox.min[2] = z;
				
				if(state.boundingBox.max[0] < x_1) state.boundingBox.max[0] = x_1;
				if(state.boundingBox.max[1] < y_1) state.boundingBox.max[1] = y_1;
				if(state.boundingBox.max[2] < z_1) state.boundingBox.max[2] = z_1;
				
				
				
				var front_face = !(planes[i+1] && planes[i+1][j] && planes[i+1][j][k] > 0);
				var back_face = !(planes[i-1] && planes[i-1][j] && planes[i-1][j][k] > 0);
				var top_face = !(planes[i][j][k+1] > 0);
				var bottom_face = !(planes[i][j][k-1] > 0);
				var right_face = !(planes[i][j+1] && planes[i][j+1][k] > 0);
				var left_face = !(planes[i][j-1] && planes[i][j-1][k] > 0);
				
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
	models[model_name].boundingBox = state.boundingBox;
	models[model_name].boundingBox.segment = createBoundingBoxSegment(state.boundingBox);
	
	return true;
}

function buildOctree(state) {
	
	var model_name = state.model_name;
	
	var x_pivot = models[model_name].pivot[0];
	var y_pivot = models[model_name].pivot[1];	
	var z_pivot = models[model_name].pivot[2];
	
	var planes = state.planes;
	
	if(!state.octree) {
		var size = 1;
		
		while(state.boundingBox.max[0] >= size) size *= 2;
		while(state.boundingBox.max[1] >= size) size *= 2;
		while(state.boundingBox.max[2] >= size) size *= 2;
		
		while(state.boundingBox.min[0] < -size) size *= 2;
		while(state.boundingBox.min[1] < -size) size *= 2;
		while(state.boundingBox.min[2] < -size) size *= 2;
		
		state.octree = new Octree(size,[0,0,0]);
	}
	
	for(var i = 0; i < planes.length; i++) {
		for(var j = 0; j < planes[i].length; j++) {
			for(var k = 0; k < planes[i][j].length; k++) {
				if(planes[i][j][k] == 0) {
					continue;
				}
				var x = j - x_pivot;
				var y = k - y_pivot;
				var z = i - z_pivot;
				
				state.octree.addVoxel([x,y,z], planes[i][j][k]);
			}
		}
	}
	
	console.log(model_name + " octree " + size + ", " + state.octree.numVoxels + " voxels");
	
	models[model_name].octree = state.octree;
	
	return true;
}


function parseComponent(state) {
	
	var model_name = state.model_name;
	var data = state.data;
	
	if(!state.initialized) {
		
		state.initialized = true;
		
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
		state.boundingBox = {"min":[0, 0, 0],"max":[0, 0, 0]};
		state.first_voxel = true;
		
		return false;
	}

	
	if(!state.parsed) {
		state.planes = parseRawModel(data);
		state.parsed = true;
		return false;
	}
	
	if(!state.segmentsBuilt) {
		state.segmentsBuilt = buildSegments(state);
		return false;
	}
	
	if(!state.octreeBuilt) {
		state.octreeBuilt = buildOctree(state);
		return false;
	}
	
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
				
				piece.reverseTransform = mat4.create();
				mat4.invert(piece.reverseTransform, piece.transform);
				//mat4.transpose(piece.reverseTransform, piece.reverseTransform);
			}
			
			
			
			var piece_loaded = loadComponent(piece['name']);
			all_loaded = all_loaded && piece_loaded;
			
			if(piece_loaded) {
				var piece_model = models[piece['name']];
				var piece_box = {"min":vec3.clone(piece_model.boundingBox.min),"max":vec3.clone(piece_model.boundingBox.max)};
				
				vec3.transformMat4(piece_box.min, piece_box.min, piece.transform);
				vec3.transformMat4(piece_box.max, piece_box.max, piece.transform);
				
				if(piece_box.min[0] > piece_box.max[0]) {
					var temp = piece_box.max[0];
					piece_box.max[0] = piece_box.min[0];
					piece_box.min[0] = temp;
				}
				if(piece_box.min[1] > piece_box.max[1]) {
					var temp = piece_box.max[1];
					piece_box.max[1] = piece_box.min[1];
					piece_box.min[1] = temp;
				}
				if(piece_box.min[2] > piece_box.max[2]) {
					var temp = piece_box.max[2];
					piece_box.max[2] = piece_box.min[2];
					piece_box.min[2] = temp;
				}
				
				if(!this_model.boundingBox) {
					this_model.boundingBox = {"min":vec3.clone(piece_box.min),"max":vec3.clone(piece_box.max)};
				}
				if(this_model.boundingBox.min[0] > piece_box.min[0]) {
					this_model.boundingBox.min[0] = piece_box.min[0];
				}
				if(this_model.boundingBox.min[1] > piece_box.min[1]) {
					this_model.boundingBox.min[1] = piece_box.min[1];
				}
				if(this_model.boundingBox.min[2] > piece_box.min[2]) {
					this_model.boundingBox.min[2] = piece_box.min[2];
				}
				if(this_model.boundingBox.max[0] < piece_box.max[0]) {
					this_model.boundingBox.max[0] = piece_box.max[0];
				}
				if(this_model.boundingBox.max[1] < piece_box.max[1]) {
					this_model.boundingBox.max[1] = piece_box.max[1];
				}
				if(this_model.boundingBox.max[2] < piece_box.max[2]) {
					this_model.boundingBox.max[2] = piece_box.max[2];
				}
				models[model_name].boundingBox.segment = createBoundingBoxSegment(this_model.boundingBox)
			}
		}
		this_model['loaded'] = all_loaded;
	}
	return this_model['loaded'];
}

function load_models() {
	var all_loaded = loadComponent(top_level_model);
	
	if(all_loaded) {
		if(all_loaded) {
			document.getElementById('loading-notification').innerHTML = "";
		}
	}
	return true;
}