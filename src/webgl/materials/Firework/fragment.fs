uniform float uTime;
uniform float uProgress;

varying vec2 vUv;
varying vec3 vPosition;

float PI = 3.141592653589793238;

// Function to create a gradient fading effect
float fadeOut(float t) {
    return exp(-t * t);
}

void main() {
    gl_FragColor = vec4(1.0, 0, 0, 1.);

    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}