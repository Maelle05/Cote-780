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
    if(uProgress > 0.99) {
        discard;
    }

    //make particles circle
    float dist = distance(gl_PointCoord, vec2(0.5, 0.5));
    if(dist > 0.5) {
        discard;
    }
    gl_FragColor = vec4(1.0, 1.0, 1.0, 0.5); 
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}