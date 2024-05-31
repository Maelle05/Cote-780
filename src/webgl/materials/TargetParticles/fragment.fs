uniform float uTime;
uniform float uProgress;

varying vec2 vUv;
varying vec3 vPosition;
varying float vIndex;

float PI = 3.141592653589793238;

float rand(float seed) {
    return fract(sin(seed) * 43758.5453123);
}

void main() {
    //make particles circle
    float dist = distance(gl_PointCoord, vec2(0.2, 0.2));
    if(dist < uProgress) {
        discard;
    }
    gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0); 
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}