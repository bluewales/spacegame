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
		//vLightWeighting = transformedNormal.xyz;
	} else {
		vLightWeighting = aVertexColor;
	}
	
}
