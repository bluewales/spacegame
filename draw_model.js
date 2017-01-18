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

function createBoundingBoxSegment(box) {
	var min_x = box.min[0];
	var min_y = box.min[1];
	var min_z = box.min[2];
	
	var max_x = box.max[0];
	var max_y = box.max[1];
	var max_z = box.max[2];
	
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
		if(this_model['loaded']) {
			for(var i = 0; i < this_model.segments.length; i++) {
				var segment = this_model.segments[i];
				draw_segment(segment);
			}
			var segment = this_model.boundingBox.segment;
			//draw_segment(segment);
		}
	} else {
		for(var i = 0; i < this_model['pieces'].length; i++) {
			var piece = this_model['pieces'][i];
			
			mvPushMatrix();
			
			if(piece.transform) mat4.multiply(mvMatrix, mvMatrix, piece.transform);
			draw_model(piece['name']);
			
			mvPopMatrix();
			
			if(this_model.boundingBox && this_model.boundingBox.segment) {
				var segment = this_model.boundingBox.segment;
				//draw_segment(segment);	
			}
		}
		
	}
}
