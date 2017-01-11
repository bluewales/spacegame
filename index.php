<!DOCTYPE HTML>
<html>

<head>
<title>Space Ship</title>
<meta http-equiv="content-type" content="text/html; charset=ISO-8859-1">

<script type="text/javascript" src="glMatrix-0.9.5.min.js"></script>
<script type="text/javascript" src="webgl-utils.js"></script>
<script type="text/javascript" src="models.js"></script>
<script type="text/javascript" src="draw_model.js"></script>

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
		top: 40px;
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
	
    uniform vec3 uAmbientColor;

    uniform vec3 uLightingDirection;
    uniform vec3 uDirectionalColor;

    varying vec3 vLightWeighting;

    void main(void) {
		
		vec4 scene_position = uMVMatrix * vec4(aVertexPosition, 1.0);
		
        gl_Position = uPMatrix * uSceneMatrix * scene_position;
		
		vec3 transformedNormal = uNormalMatrix * aVertexNormal;
		if(uLightingEnable){
			float directionalLightWeighting = max(dot(transformedNormal.xyz, uLightingDirection), 0.0);
			float lightWeighting = directionalLightWeighting + 0.3;
			
			vLightWeighting = aVertexColor * lightWeighting;
		} else {
			vLightWeighting = aVertexColor;
		}
		//vLightWeighting = transformedNormal.xyz;
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
		console.log(shaderProgram.vertexNormalAttribute);
        gl.enableVertexAttribArray(shaderProgram.vertexNormalAttribute);
		
		shaderProgram.vertexColorAttribute = gl.getAttribLocation(shaderProgram, "aVertexColor");
		console.log(shaderProgram.vertexColorAttribute);
        gl.enableVertexAttribArray(shaderProgram.vertexColorAttribute);

        shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
        shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
        shaderProgram.sceneMatrixUniform = gl.getUniformLocation(shaderProgram, "uSceneMatrix");
		shaderProgram.nMatrixUniform = gl.getUniformLocation(shaderProgram, "uNormalMatrix");
		shaderProgram.lightingEnableUniform = gl.getUniformLocation(shaderProgram, "uLightingEnable");
        shaderProgram.ambientColorUniform = gl.getUniformLocation(shaderProgram, "uAmbientColor");
        shaderProgram.lightingDirectionUniform = gl.getUniformLocation(shaderProgram, "uLightingDirection");
        shaderProgram.directionalColorUniform = gl.getUniformLocation(shaderProgram, "uDirectionalColor");
    }


    var mvMatrix = mat4.create();
    var mvMatrixStack = [];
    var pMatrix = mat4.create();
	var sceneMatrix = mat4.create();

    function mvPushMatrix() {
        var copy = mat4.create();
        mat4.set(mvMatrix, copy);
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

        gl.uniformMatrix4fv(shaderProgram.sceneMatrixUniform, false, sceneMatrix);
		
		var normalMatrix = mat3.create();
		mat4.toInverseMat3(mvMatrix, normalMatrix);
		mat3.transpose(normalMatrix);
		gl.uniformMatrix3fv(shaderProgram.nMatrixUniform, false, normalMatrix);
    }
	
	var line_segment;
	
	function create_laser(x, y, z) {
		var vertexPositions = [
			x, y, z,
			0, 0, 0
		];
		vertexNormals = [0.0,0.0,1.0, 0.0,0.0,1.0];
		vertexColors = [0.0,0.0,1.0, 0.0,0.0,1.0];
		vertexCount = 2;
		vertexIndecis = [0,1];
		indecisCount = 2;
		
		line_segment = createNewSegment(vertexPositions, vertexNormals, vertexColors, vertexCount, vertexIndecis, indecisCount);
		line_segment.mode = gl.LINES;
		line_segment.useLighting = false;
	}
	
	function update_laser(x, y, z) {
		gl.bindBuffer(gl.ARRAY_BUFFER, line_segment.shipVertexPositionBuffer);
		gl.bufferSubData(gl.ARRAY_BUFFER, 0, new Float32Array([x, y, z]));
	}


    function degToRad(degrees) {
        return degrees * Math.PI / 180;
    }


	
	var currentlyPressedKeys = {};
		
    function handleKeyDown(event) {
        currentlyPressedKeys[event.keyCode] = true;
		
		if(event.keyCode == 32) { // space bar
			var x = radius * Math.cos(theta - Math.PI/2) * Math.cos(psi - Math.PI/2);
			var y = radius * Math.sin(theta - Math.PI/2) * Math.cos(psi - Math.PI/2);
			var z = radius * Math.sin(psi + Math.PI/2);
			x += Math.random()*20 - 10;
			y += Math.random()*20 - 10
			z += Math.random()*20 - 10
			update_laser(x, y, z);
		}
    }
    function handleKeyUp(event) {
        currentlyPressedKeys[event.keyCode] = false;
    }
	function handleMouseWheel(event) {
		
		var faster = currentlyPressedKeys[16];
		var speed = (faster)?10:1;
		
		radius -= (event.wheelDelta / 100) * speed;
		
	}


    
	
	var theta = 1;
	var d_theta = 0;
	var psi = Math.PI/2;
	var d_psi = 0;
	var radius = 600;
	var d_radius = 0;

    function handleKeys() {
		var faster = currentlyPressedKeys[16];
		var speed = (faster)?10:1;
		
        if (currentlyPressedKeys[33]) {
            // Page Up
            d_radius = 0.1 * speed;
        } else if (currentlyPressedKeys[34]) {
            // Page Down
            d_radius = -0.1 * speed;
        } else {
            d_radius = 0;
        }

        if (currentlyPressedKeys[37] || currentlyPressedKeys[65]) {
            // Left cursor key or A
            d_theta = 0.0003 * speed;
        } else if (currentlyPressedKeys[39] || currentlyPressedKeys[68]) {
            // Right cursor key or D
            d_theta = -0.0003 * speed;
        } else {
            d_theta = 0;
        }

        if (currentlyPressedKeys[38] || currentlyPressedKeys[87]) {
            // Up cursor key or W
            d_psi = 0.0003 * speed;
        } else if (currentlyPressedKeys[40] || currentlyPressedKeys[83]) {
            // Down cursor key
            d_psi = -0.0003 * speed;
        } else {
            d_psi = 0;
        }
    }
	
	var lightingDirection = [Math.random()*2-1, Math.random()*2-1, -1];

	var frame_count = 0;
	
    function drawScene() {
		
        gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		
		gl.uniform3f(shaderProgram.ambientColorUniform, 0.3, 0.3, 0.3);
		gl.uniform3f(shaderProgram.directionalColorUniform, 0.7, 0.7, 0.7);
		
		var adjustedLD = vec3.create();
		vec3.normalize(lightingDirection, adjustedLD);
		vec3.scale(adjustedLD, -1);
		gl.uniform3fv(shaderProgram.lightingDirectionUniform, adjustedLD);

        mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 10000.0, pMatrix);

        mat4.identity(mvMatrix);
		mat4.identity(sceneMatrix);

		mat4.translate(sceneMatrix, [0, 0, -radius]);
		mat4.rotate(sceneMatrix, (-psi), [1, 0, 0]);
		mat4.rotate(sceneMatrix, (-theta), [0, 0, 1]);
		
		var x = 100;
		var y = 100;
		var z = 100;
		var yaw = 0;
		var pitch = 0;
		var roll = 0;
		
		var all_loaded = draw_model("small room", 0, 0, 0, 0, 0, 0);
		//draw_segment(line_segment);
		
		//var all_loaded = draw_model("2x2 wall", 0, 0, 0, yaw, pitch, roll);
		
		if(all_loaded) {
			document.getElementById('loading-notification').innerHTML = "";
		} else {
			var t = (new Date()).getTime() - start_time;
			console.log("Not loaded " + t);
		}
		frame_count += 1;
    }


    var lastTime = 0;
	
	var FPS = 60;
	var l_y = 0;

    function animate() {
        var timeNow = new Date().getTime();
        if (lastTime != 0) {
            var elapsed = timeNow - lastTime; 

			theta += d_theta * elapsed;
            psi += d_psi * elapsed;
			if(psi > Math.PI) {
				psi = Math.PI;
			}
			if(psi < 0) {
				psi = 0;
			}
			radius += d_radius * elapsed;
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
    }


    function webGLStart() {
        var canvas = document.getElementById("game-canvas");
		
		start_time = (new Date()).getTime();
		
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
		
        initGL(canvas);
        initShaders();

        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.enable(gl.DEPTH_TEST);
		
		document.onkeydown = handleKeyDown;
        document.onkeyup = handleKeyUp;
		document.onmousewheel = handleMouseWheel;

		create_laser(400, 0, 0);
		
        tick();
    }

</script>


</head>


<body onload="webGLStart();" id="body-element" >
    <canvas id="game-canvas" style="border: none;" width="1000" height="1000"></canvas>
	
	<p id="directions">
	w,a,s,d to rotate
	<br/>
	mouse wheel (or page up/page down) to zoom
	<br/>
	<span id="status"><span>
	</p>
	<p id="fps"></p>
	<p id="loading-notification" >Loading</p>
</body>


</html>
