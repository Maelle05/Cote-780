uniform float uTime;
uniform sampler2D uTexture;
uniform sampler2D uNoiseTexture;

varying vec2 vUv;
varying float vIndex;
varying vec3 vPosition;

float PI = 3.141592653589793238;

float rand(float seed) {
    return fract(sin(seed) * 43758.5453123);
}

void main() {
    // vec2 nUv1 = vUv * 0.2;
    // nUv1.y += uTime * 0.005;
    // vec4 noise1Color = texture2D(uNoiseTexture, nUv1);

    // vec2 nUv2 = vUv * 0.5;
    // nUv2.x += uTime * 0.005;
    // vec4 noise2Color = texture2D(uNoiseTexture, nUv2);

    // vec4 finalNoise = noise1Color * noise2Color;

    // vec2 displacedUv = vUv + (finalNoise.rg - 0.5) * 0.2;
    vec4 textureColor = texture2D(uTexture, vUv);

    gl_FragColor = textureColor;

    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}
