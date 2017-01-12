function shuffle(array) {
	var currentIndex = array.length, temporaryValue, randomIndex;

	// While there remain elements to shuffle...
	while (0 !== currentIndex) {

		// Pick a remaining element...
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;

		// And swap it with the current element.
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}

	return array;
}


function createNewSegment(vertexPositions, vertexNormals, vertexColors, vertexCount, vertexIndecis, indecisCount) {
	var segment = {};
	
	segment.shipVertexPositionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, segment.shipVertexPositionBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexPositions), gl.DYNAMIC_DRAW);
	segment.shipVertexPositionBuffer.itemSize = 3;
	segment.shipVertexPositionBuffer.numItems = vertexCount;
	
	segment.shipVertexNormalBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, segment.shipVertexNormalBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexNormals), gl.STATIC_DRAW);
	segment.shipVertexNormalBuffer.itemSize = 3;
	segment.shipVertexNormalBuffer.numItems = vertexCount;
	
	segment.shipVertexColorBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, segment.shipVertexColorBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexColors), gl.DYNAMIC_DRAW);
	segment.shipVertexColorBuffer.itemSize = 3;
	segment.shipVertexColorBuffer.numItems = vertexCount;
	
	segment.shipVertexIndexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, segment.shipVertexIndexBuffer);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(vertexIndecis), gl.STATIC_DRAW);
	segment.shipVertexIndexBuffer.itemSize = 1;
	segment.shipVertexIndexBuffer.numItems = indecisCount;
	
	segment.vertexPositions = vertexPositions;
	segment.vertexNormals = vertexNormals;
	segment.vertexColors = vertexColors;
	segment.vertexIndecis = vertexIndecis;
	
	segment.vertexCount = vertexCount;
	segment.indecisCount = indecisCount;
	
	segment.mode = gl.TRIANGLES;
	segment.useLighting = true;
	
	return segment;
}

function createBoundingBoxSegment(min_x, min_y, min_z, max_x, max_y, max_z) {
	max_x += 1;
	max_y += 1;
	max_z += 1;
	
	vertexPositions = [
		min_x, min_y, min_z,
		min_x, min_y, max_z,
		min_x, max_y, min_z,
		min_x, max_y, max_z,
		max_x, min_y, min_z,
		max_x, min_y, max_z,
		max_x, max_y, min_z,
		max_x, max_y, max_z
	];
	vertexNormals = [0.0,0.0,1.0, 0.0,0.0,1.0, 0.0,0.0,1.0, 0.0,0.0,1.0, 0.0,0.0,1.0, 0.0,0.0,1.0, 0.0,0.0,1.0, 0.0,0.0,1.0];
	vertexColors = [1.0,0.0,0.0, 1.0,0.0,0.0, 1.0,0.0,0.0, 1.0,0.0,0.0, 1.0,0.0,0.0, 1.0,0.0,0.0, 1.0,0.0,0.0, 1.0,0.0,0.0];
	vertexCount = 8;
	vertexIndecis = [0,1, 1,3, 3,2, 2,0, 0,4, 1,5, 3,7, 2,6, 4,5, 5,7, 7,6, 6,4];
	indecisCount = 24;
	
	var segment = createNewSegment(vertexPositions, vertexNormals, vertexColors, vertexCount, vertexIndecis, indecisCount);
	segment.mode = gl.LINES;
	segment.useLighting = false;
	
	return segment;
}


function handleLoadedModelGrid(model_name, data) {

	var x_pivot = models[model_name].pivot.x;
	var y_pivot = models[model_name].pivot.y;	
	var z_pivot = models[model_name].pivot.z;
	
	models[model_name].segments = [];
	
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
	
	var vertexPositions = [];
	var vertexNormals = [];
	var vertexColors = [];
	var vertexCount = 0;
	var vertexIndecis = [];
	var indecisCount = 0;
	
	var bounding_box = {"min":{"x":0,"y":0,"z":0},"max":{"x":0,"y":0,"z":0}};
	var first_voxel = true;
	
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
					bounding_box.min.x = x;
					bounding_box.min.y = y;
					bounding_box.min.z = z;
					
					bounding_box.max.x = x;
					bounding_box.max.y = y;
					bounding_box.max.z = z;
					first_voxel = false;
				}
				
				if(bounding_box.min.x > x) bounding_box.min.x = x;
				if(bounding_box.min.y > y) bounding_box.min.y = y;
				if(bounding_box.min.z > z) bounding_box.min.z = z;
				
				if(bounding_box.max.x < x) bounding_box.max.x = x;
				if(bounding_box.max.y < y) bounding_box.max.y = y;
				if(bounding_box.max.z < z) bounding_box.max.z = z;
				
				
				
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
					vertexPositions.push(x, y, z_1, x_1, y, z_1, x_1, y_1, z_1, x, y_1, z_1);
					vertexNormals.push(0.0,  0.0,  1.0,  0.0,  0.0,  1.0,  0.0,  0.0,  1.0,  0.0,  0.0,  1.0);
				}
				if(back_face) {
					vertexPositions.push(x, y, z, x, y_1, z, x_1, y_1, z, x_1, y, z);
					vertexNormals.push(0.0,  0.0, -1.0,  0.0,  0.0, -1.0,  0.0,  0.0, -1.0,  0.0,  0.0, -1.0);
				}
				if(top_face) {
					vertexPositions.push(x, y_1, z, x, y_1, z_1, x_1, y_1, z_1, x_1, y_1, z);
					vertexNormals.push(0.0,  1.0,  0.0,  0.0,  1.0,  0.0,  0.0,  1.0,  0.0,  0.0,  1.0,  0.0);
				}
				if(bottom_face) {
					vertexPositions.push(x, y, z, x_1, y, z, x_1, y, z_1, x, y, z_1);
					vertexNormals.push(0.0, -1.0,  0.0,  0.0, -1.0,  0.0,  0.0, -1.0,  0.0,  0.0, -1.0,  0.0);
				}
				if(right_face) {
					vertexPositions.push(x_1, y, z, x_1, y_1, z, x_1, y_1, z_1, x_1, y, z_1);
					vertexNormals.push(1.0,  0.0,  0.0,  1.0,  0.0,  0.0,  1.0,  0.0,  0.0,  1.0,  0.0,  0.0);
				}
				if(left_face) {
					vertexPositions.push(x, y, z, x, y, z_1, x, y_1, z_1, x, y_1, z);
					vertexNormals.push(-1.0,  0.0,  0.0, -1.0,  0.0,  0.0, -1.0,  0.0,  0.0, -1.0,  0.0,  0.0);
				}
				
				var cubeVertexIndices = [];
				var faces = [front_face, back_face, top_face, bottom_face, right_face, left_face];
				for(var index in faces) {
					if(faces[index]) {
						cubeVertexIndices.push(0 + vertexCount, 1 + vertexCount, 2 + vertexCount, 0 + vertexCount, 2 + vertexCount, 3 + vertexCount);
						vertexColors.push(color.r,color.g,color.b,color.r,color.g,color.b,color.r,color.g,color.b,color.r,color.g,color.b);
						vertexCount += 4;
						indecisCount += 6;
					}
				}
				vertexIndecis = vertexIndecis.concat(cubeVertexIndices);
				
				if(vertexCount + 24 >= 65536) {
					var new_segment = createNewSegment(vertexPositions, vertexNormals, vertexColors, vertexCount, vertexIndecis, indecisCount);
					models[model_name].segments.push(new_segment);
					
					vertexPositions = [];
					vertexNormals = [];
					vertexColors = [];
					vertexCount = 0;
					vertexIndecis = [];
					indecisCount = 0;
				}
			}
		}
	}
	
	var new_segment = createNewSegment(vertexPositions, vertexNormals, vertexColors, vertexCount, vertexIndecis, indecisCount);
	models[model_name].segments.push(new_segment);
	models[model_name].bounding_box = bounding_box;
	
	models[model_name].bounding_box.segment = createBoundingBoxSegment(
		bounding_box.min.x, bounding_box.min.y, bounding_box.min.z,
		bounding_box.max.x, bounding_box.max.y, bounding_box.max.z
	);
}


function draw_segment(segment) {
	
	gl.uniform1i(shaderProgram.lightingEnableUniform, segment.useLighting);
	
	gl.bindBuffer(gl.ARRAY_BUFFER, segment.shipVertexPositionBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, segment.shipVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
	
	gl.bindBuffer(gl.ARRAY_BUFFER, segment.shipVertexNormalBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, segment.shipVertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);
	
	gl.bindBuffer(gl.ARRAY_BUFFER, segment.shipVertexColorBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, segment.shipVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, segment.shipVertexIndexBuffer);
	setMatrixUniforms();
	gl.drawElements(segment.mode, segment.shipVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
}

var color_march = 0;

function random_color(model_name) {
	
	var segment_index = 0;
	
	var r = 0.5;
	var g = 0.5;
	var b = 1.0;
	
	color_march = Math.floor(Math.random() * 100000000);
	
	var color_index = color_march * 12;
	color_index %= models[model_name].segments[segment_index].vertexColors.length;
	
	r = models[model_name].segments[segment_index].vertexColors[color_index+0] + .01;
	g = 1 - r;
	b = 1 - r;
	
	if(r > 1) {r = 0;}
	
	models[model_name].segments[segment_index].vertexColors[color_index+0] = r;
		
	gl.bindBuffer(gl.ARRAY_BUFFER, models[model_name].segments[segment_index].shipVertexColorBuffer);
	gl.bufferSubData(gl.ARRAY_BUFFER, color_index * 4, new Float32Array([r,g,b,r,g,b,r,g,b,r,g,b]));
}

var count = 0;

function draw_model(model_name) {
	
	var this_model = models[model_name];
	
	if(this_model['basic']) {
		if(!this_model['loading'] && !this_model['loaded']) {
			models[model_name]['loading'] = true;
			
			var request = new XMLHttpRequest();
			request.open("GET", this_model['file_location']);
			request.onreadystatechange = function () {
				if (request.readyState == 4) {
					handleLoadedModelGrid(model_name, request.responseText);
					models[model_name]['loaded'] = true;
				}
			}
			request.send();
		}
		if(this_model['loaded']) {
			for(var i = 0; i < this_model.segments.length; i++) {
				var segment = this_model.segments[i];
				draw_segment(segment);
			}
			var segment = this_model.bounding_box.segment;
			draw_segment(segment);
		}
		return this_model['loaded'];
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
				
				this_model['pieces'][i].transform = transform;
			}
			
			if(count < 10) {
				console.log(i + " transform " + JSON.stringify(piece.transform));
				console.log(i + " mvMatrix " + JSON.stringify(mvMatrix));
				count+=1;
			}
			
			mvPushMatrix();
			mat4.multiply(mvMatrix, mvMatrix, piece.transform);
			
			var loaded = draw_model(piece['name']);
			all_loaded = all_loaded && loaded;
			
			mvPopMatrix();
		}
		
		models[model_name]['loaded'] = all_loaded;
		return all_loaded;
	}
}
