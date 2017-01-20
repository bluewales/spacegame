<!DOCTYPE HTML>
<html>

<head>
<title>Space Ship</title>

<script type="text/javascript" src="gl-matrix-min.js"></script>
<script type="text/javascript" src="webgl-utils.js"></script>
<script type="text/javascript" src="models.js"></script>
<script type="text/javascript" src="draw_model.js"></script>
<script type="text/javascript" src="coroutines.js"></script>
<script type="text/javascript" src="parse_model.js"></script>
<script type="text/javascript" src="intersections.js"></script>
<script type="text/javascript" src="octree.js"></script>

<link rel="import" href="shader.vert">
<link rel="import" href="shader.frag">

<style>
	canvas {
		position: absolute;
		left: 0px;
		top: 0px;
		color:black;
	}
	p {
		color: white;
	}
	#directions {
		position: absolute;
		left: 10px;
		top: 0px;
	}
	#fps {
		position: absolute;
		left: 10px;
		top: 56px;
	}
	#loading-notification {
		position: absolute;
		left: 50%;
		top: 50%;
		font-size: 4em;
		margin-left: -150px;
		margin-top: -60px;
	}
</style>

<script id="shader-fs" type="x-shader/x-fragment">
    precision mediump float;

    varying vec3 vLightWeighting;

    void main(void) {
        gl_FragColor = vec4(vLightWeighting, 1.0);
    }
</script>

<script id="shader-vs" type="x-shader/x-vertex">
	attribute vec3 aVertexPosition;
    attribute vec3 aVertexNormal;
	attribute vec3 aVertexColor;

    uniform mat4 uMVMatrix;
    uniform mat4 uPMatrix;
    uniform mat4 uSceneMatrix;
	
	uniform mat3 uNormalMatrix;

	uniform bool uLightingEnable;
	
    uniform vec3 uKeyLightingDirection;
	uniform vec3 uFillLightingDirection;
	uniform vec3 uBackLightingDirection;
	
    uniform vec3 uKeyLightingColor;
	uniform vec3 uFillLightingColor;
	uniform vec3 uBackLightingColor;

    varying vec3 vLightWeighting;

    void main(void) {
		
		vec4 cameraPosition = uMVMatrix * vec4(aVertexPosition, 1.0);
		
        gl_Position = uPMatrix * uSceneMatrix * cameraPosition;
		
		vec3 transformedNormal = uNormalMatrix * aVertexNormal;
		if(uLightingEnable){
			float keyLightWeighting  = max(dot(transformedNormal.xyz, uKeyLightingDirection), 0.0);
			float fillLightWeighting = max(dot(transformedNormal.xyz, uFillLightingDirection), 0.0);
			float backLightWeighting = max(dot(transformedNormal.xyz, uBackLightingDirection), 0.0);
			
			vec3 overallLighting = uKeyLightingColor*keyLightWeighting + uFillLightingColor*fillLightWeighting + uBackLightingColor*backLightWeighting;
			
			vLightWeighting = overallLighting * aVertexColor;
			//vLightWeighting = transformedNormal.xyz;
		} else {
			vLightWeighting = aVertexColor;
		}
		
    }
</script>


<script type="text/javascript">

    var gl;
	var start_time = 0;
	
    function initGL(canvas) {
        try {
            gl = canvas.getContext("experimental-webgl");
            gl.viewportWidth = canvas.width;
            gl.viewportHeight = canvas.height;
        } catch (e) {
        }
        if (!gl) {
            alert("Could not initialise WebGL, sorry :-(");
        }
    }


    function getShader(gl, id) {
        var shaderScript = document.getElementById(id);
        if (!shaderScript) {
            return null;
        }

        var str = "";
        var k = shaderScript.firstChild;
        while (k) {
            if (k.nodeType == 3) {
                str += k.textContent;
            }
            k = k.nextSibling;
        }

        var shader;
        if (shaderScript.type == "x-shader/x-fragment") {
            shader = gl.createShader(gl.FRAGMENT_SHADER);
        } else if (shaderScript.type == "x-shader/x-vertex") {
            shader = gl.createShader(gl.VERTEX_SHADER);
        } else {
            return null;
        }

        gl.shaderSource(shader, str);
        gl.compileShader(shader);

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            alert(gl.getShaderInfoLog(shader));
            return null;
        }

        return shader;
    }


    var shaderProgram;

    function initShaders() {
        var fragmentShader = getShader(gl, "shader-fs");
        var vertexShader = getShader(gl, "shader-vs");

        shaderProgram = gl.createProgram();
        gl.attachShader(shaderProgram, vertexShader);
        gl.attachShader(shaderProgram, fragmentShader);
        gl.linkProgram(shaderProgram);

        if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
            alert("Could not initialise shaders");
        }

        gl.useProgram(shaderProgram);

        shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
        gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

        shaderProgram.vertexNormalAttribute = gl.getAttribLocation(shaderProgram, "aVertexNormal");
        gl.enableVertexAttribArray(shaderProgram.vertexNormalAttribute);
		
		shaderProgram.vertexColorAttribute = gl.getAttribLocation(shaderProgram, "aVertexColor");
        gl.enableVertexAttribArray(shaderProgram.vertexColorAttribute);

        shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
        shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
        shaderProgram.cameraMatrixUniform = gl.getUniformLocation(shaderProgram, "uSceneMatrix");
		shaderProgram.nMatrixUniform = gl.getUniformLocation(shaderProgram, "uNormalMatrix");
		shaderProgram.lightingEnableUniform = gl.getUniformLocation(shaderProgram, "uLightingEnable");
        shaderProgram.keyLightingDirectionUniform = gl.getUniformLocation(shaderProgram, "uKeyLightingDirection");
		shaderProgram.fillLightingDirectionUniform = gl.getUniformLocation(shaderProgram, "uFillLightingDirection");
		shaderProgram.backLightingDirectionUniform = gl.getUniformLocation(shaderProgram, "uBackLightingDirection");
        shaderProgram.keyColorUniform = gl.getUniformLocation(shaderProgram, "uKeyLightingColor");
		shaderProgram.fillColorUniform = gl.getUniformLocation(shaderProgram, "uFillLightingColor");
		shaderProgram.backColorUniform = gl.getUniformLocation(shaderProgram, "uBackLightingColor");
    }


    var mvMatrix = mat4.create();
    var mvMatrixStack = [];
    var pMatrix = mat4.create();
	var cameraMatrix = mat4.create();
	mat4.identity(cameraMatrix);
	mat4.rotateX(cameraMatrix, cameraMatrix, Math.PI/2);

    function mvPushMatrix() {
        var copy = mat4.clone(mvMatrix);
        mvMatrixStack.push(copy);
    }

    function mvPopMatrix() {
        if (mvMatrixStack.length == 0) {
            throw "Invalid popMatrix!";
        }
        mvMatrix = mvMatrixStack.pop();
    }


    function setMatrixUniforms() {
        gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
        gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);

        gl.uniformMatrix4fv(shaderProgram.cameraMatrixUniform, false, cameraMatrix);
		
		var normalMatrix = mat3.create();
		mat3.normalFromMat4(normalMatrix, mvMatrix);
		
		gl.uniformMatrix3fv(shaderProgram.nMatrixUniform, false, normalMatrix);
    }
	
	var laser;
	
	function create_laser(x, y, z) {
		
		laser = {};
		laser.origin = [x, y, z];
		laser.dir = [-x, -y, -z];
		laser.length = Math.sqrt(x*x + y*y + z*z);
		
		vec3.normalize(laser.dir, laser.dir);
		
		
		
		var vertexPositions = [x, y, z, 0, 0, 0];
		vertexNormals = [0.0,0.0,1.0, 0.0,0.0,1.0];
		vertexColors = [0.0,0.0,1.0, 0.0,0.0,1.0];
		vertexCount = 2;
		vertexIndecis = [0,1];
		indecisCount = 2;
		
		laser.segment = createNewSegment(vertexPositions, vertexNormals, vertexColors, vertexCount, vertexIndecis, indecisCount);
		laser.segment.mode = gl.LINES;
		laser.segment.useLighting = false;
	}
	
	function update_laser() {
		
		var x = Math.random() * 300 - 150;
		var y = Math.random() * 300 - 150
		var z = Math.random() * 300 - 150;
		
		x = 300;
		y = 200;
		z = 1;
		
		console.log(x + " " + y + " " + z);
		
		laser.origin = [x, y, z];
		laser.end = [0, 0, 0];
		vec3.sub(laser.dir, laser.end, laser.origin);
		vec3.normalize(laser.dir, laser.dir);
		
		laser.length = Math.sqrt(vec3.sqrDist(laser.origin, laser.end));
		laser.dirfrac = undefined;
		
		laser.segment.vertexPositions = [laser.origin[0], laser.origin[1], laser.origin[2], laser.end[0], laser.end[1], laser.end[2]];
		
		gl.bindBuffer(gl.ARRAY_BUFFER, laser.segment.shipVertexPositionBuffer);
		gl.bufferSubData(gl.ARRAY_BUFFER, 0, new Float32Array(laser.segment.vertexPositions));
		
		var transform = mat4.create();
		mat4.identity(transform);
		
		collision_checks = 0;
		var start = Date.now();
		
		laser_vs_component(laser, top_level_model, transform);
		
		var end = Date.now();
		
		console.log("Time " + (end - start));
		
		console.log(collision_checks);
	}


    function degToRad(degrees) {
        return degrees * Math.PI / 180;
    }


	
	var currentlyPressedKeys = {};
		
    function handleKeyDown(event) {
        currentlyPressedKeys[event.keyCode] = true;
		
		if(event.keyCode == 32) { // space bar
			
			update_laser();
		}
    }
    function handleKeyUp(event) {
        currentlyPressedKeys[event.keyCode] = false;
    }
	function handleMouseWheel(event) {
		
		var faster = currentlyPressedKeys[16];
		var speed = (faster)?10:1;
		
	}
	
	
	var navigationMatrix = mat4.create();

    function handleKeys() {
		var faster = currentlyPressedKeys[16];
		var speed = (faster)?10:1;
		
        if (currentlyPressedKeys[33]) {
            // Page Up
            
        } else if (currentlyPressedKeys[34]) {
            // Page Down
            
        }

        if (currentlyPressedKeys[37] || currentlyPressedKeys[65]) {
            // Left cursor key or A
			mat4.identity(navigationMatrix);
            mat4.rotateY(navigationMatrix, navigationMatrix, -0.07);
			mat4.mul(cameraMatrix,navigationMatrix,cameraMatrix);
			
        } else if (currentlyPressedKeys[39] || currentlyPressedKeys[68]) {
            // Right cursor key or D
			mat4.identity(navigationMatrix);
            mat4.rotateY(navigationMatrix, navigationMatrix, 0.07);
			mat4.mul(cameraMatrix,navigationMatrix,cameraMatrix);
        }

        if (currentlyPressedKeys[38] || currentlyPressedKeys[87]) {
            // Up cursor key or W
			mat4.identity(navigationMatrix);
			mat4.translate(navigationMatrix, navigationMatrix, [0, 0, 0.7 * speed]);
			mat4.mul(cameraMatrix,navigationMatrix,cameraMatrix);
			
        } else if (currentlyPressedKeys[40] || currentlyPressedKeys[83]) {
            // Down cursor key or S
			mat4.identity(navigationMatrix);
            mat4.translate(navigationMatrix, navigationMatrix, [0, 0, -0.7 * speed]);
			mat4.mul(cameraMatrix,navigationMatrix,cameraMatrix);
        }
		
		if (currentlyPressedKeys[81]) {
            // Q
			mat4.identity(navigationMatrix);
            mat4.rotateX(navigationMatrix, navigationMatrix, 0.07);
			mat4.mul(cameraMatrix,navigationMatrix,cameraMatrix);
			
        } else if (currentlyPressedKeys[69]) {
            // E
			mat4.identity(navigationMatrix);
            mat4.rotateX(navigationMatrix, navigationMatrix, -0.07);
			mat4.mul(cameraMatrix,navigationMatrix,cameraMatrix);
        }
    }
	
	var keyLightingDirection = [-1.0, -2.0, -0.5];
	var fillLightingDirection = [-2.0, 1.0, -1.5];
	var backLightingDirection = [2.0, 1.0, 3.0];
	vec3.normalize(keyLightingDirection, keyLightingDirection);
	vec3.normalize(fillLightingDirection, fillLightingDirection);
	vec3.normalize(backLightingDirection, backLightingDirection);
	
	var keyLightingColor = [1.0, 1.0, 1.0];
	var fillLightingColor = [1.0, 1.0, 0.75];
	var backLightingColor = [0.75, 1.0, 1.0];
	vec3.scale(keyLightingColor, keyLightingColor, 0.8);
	vec3.scale(fillLightingColor, fillLightingColor, 0.4);
	vec3.scale(backLightingColor, backLightingColor, 0.4);
	
	var frame_count = 0;
	
	var testBoundingBox = {"min":vec3.fromValues(-150, -150, -150),"max":vec3.fromValues(150, 150, 150)};
	
	var top_level_model = "small room";
	//var top_level_model = "2x2 wall";
	//var top_level_model = "inner hull corner";
	//var top_level_model = "2x2 wall with door";
	
    function drawScene() {
		
        gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		
		gl.uniform3fv(shaderProgram.keyLightingDirectionUniform, keyLightingDirection);
		gl.uniform3fv(shaderProgram.fillLightingDirectionUniform, fillLightingDirection);
		gl.uniform3fv(shaderProgram.backLightingDirectionUniform, backLightingDirection);
		
		gl.uniform3fv(shaderProgram.keyColorUniform, keyLightingColor);
		gl.uniform3fv(shaderProgram.fillColorUniform, fillLightingColor);
		gl.uniform3fv(shaderProgram.backColorUniform, backLightingColor);

        mat4.perspective(pMatrix, Math.PI/4, gl.viewportWidth / gl.viewportHeight, 1.0, 10000.0);

        mat4.identity(mvMatrix);
		
		//world elements
		draw_segment(testBoundingBox.segment);
		draw_segment(laser.segment);
		
		//apply tranform for ship space
		//mat4.rotateZ(mvMatrix, mvMatrix, frame_count/400);
		
		draw_model(top_level_model);
		
		frame_count += 1;
    }

    var lastTime = 0;
	
	var FPS = 0;

    function animate() {
        var timeNow = new Date().getTime();
		var elapsed = 0;
        if (lastTime != 0) {
            elapsed = timeNow - lastTime;
        }
        lastTime = timeNow;
		
		var alpha = .01;
		
		if(elapsed > 0) {
			FPS = FPS * (1-alpha) + (1000/elapsed) * alpha;
			document.getElementById("fps").innerHTML = "FPS: " + Math.floor(FPS);
		}
    }

    function tick() {
		
        requestAnimFrame(tick);
        drawScene();
        animate();
		handleKeys();
		
		continue_coroutines(5);
    }


    function webGLStart() {
        var canvas = document.getElementById("game-canvas");
		
		start_time = (new Date()).getTime();
		
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
		
        initGL(canvas);
        initShaders();
		register_coroutine(load_models);

        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.enable(gl.DEPTH_TEST);
		
		document.onkeydown = handleKeyDown;
        document.onkeyup = handleKeyUp;
		document.onmousewheel = handleMouseWheel;

		create_laser(0, 0, 0);
		testBoundingBox.segment = createBoundingBoxSegment(testBoundingBox);
		
        tick();
    }

</script>
</head>
	<body onload="webGLStart();" id="body-element">
		<canvas id="game-canvas" style="border: none;" width="1000" height="1000"></canvas>
		<p id="directions">
			w,a,s,d to move
			<br/>
			hold shift to go faster
			<br/>
			
			<br/>
			<span id="status"></span>
		</p>
		<p id="fps"></p>
		<p id="loading-notification">Loading</p>
	</body>
</html>

