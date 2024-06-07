uniform float uTime;
uniform float uProgress;
uniform float uSize;

uniform vec3 uP1;

varying vec2 vUv;
varying float vIndex;
varying vec3 vPosition;

float PI = 3.141592653589793238;

float rand(float seed) {
    return fract(sin(seed) * 43758.5453123);
}

void main() {
    //make particles circle
    vec2 center = vPosition.xy;

    // vec2 center = vec2(0);
    // center.x += uSize;
    // center.y -= uSize;
    float dist = distance(vec2(0.5, 0.5), gl_PointCoord);
    float radius = 0.5;

    if(dist > radius) {
        discard;
    }

    // gl_FragColor = vec4(gl_PointCoord, 1.0, 1.0); 
    gl_FragColor = vec4(1., 1., 1., 1. - dist); 
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}