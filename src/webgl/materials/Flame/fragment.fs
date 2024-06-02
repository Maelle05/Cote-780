uniform float uTime;

varying vec2 vUv;
varying vec3 vPosition;
varying float vSize;
varying float vSpeed;
varying float vElevation;

float PI = 3.141592653589793238;

void main() {
    gl_FragColor = vec4(1.0, vSpeed, 0.0, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}