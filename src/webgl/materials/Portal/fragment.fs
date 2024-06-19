uniform float uTime;
uniform float uProgress;
uniform vec2 uMouse;
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
    // gradient outside
    float edgeSize = 0.10;
    vec2 innerStart = vec2(edgeSize);
    vec2 innerEnd = vec2(1. - edgeSize, 1.);
    vec2 d = max(innerStart - vUv, vUv - innerEnd);
    float distance = max(d.x, d.y);
    float gradient = smoothstep(0.0, edgeSize, distance);

    vec2 nUv1 = vUv * 0.2;
    nUv1.y += uTime * 0.01;
    vec4 noise1Color = texture2D(uNoiseTexture, nUv1);

    vec2 nUv2 = vUv * 0.1;
    nUv2.x += uTime * 0.02;
    vec4 noise2Color = texture2D(uNoiseTexture, nUv2);

    vec4 finalNoise = noise1Color * noise2Color;

    // Parallax and scale effect
    vec2 parallaxUv = vUv * 0.9;
    parallaxUv.x += 0.05;
    parallaxUv += (uMouse - 0.5) * 0.1;

    vec2 displacedUv = parallaxUv + (finalNoise.rg - 0.5) * 0.2;
    vec4 textureColor = texture2D(uTexture, 1. - displacedUv);

    vec4 gradientColor = mix(textureColor, vec4(1., 1., 1., 1.0), gradient);

    // Apply the vertical progress-based alpha animation
    float noiseValue = finalNoise.r;

    float modulatedNoise;
    if(uProgress <= 0.1) {
        modulatedNoise = smoothstep(0.0, 0.1, uProgress) * noiseValue;
    } else if(uProgress > 0.8) {
        modulatedNoise = smoothstep(1.0, 0.8, uProgress) * noiseValue;
    } else {
        modulatedNoise = noiseValue;
    }

    float noisyUvY = vUv.y + modulatedNoise * 0.5;
    float alphaMask = step(1. - noisyUvY, uProgress);
    gradientColor.a *= alphaMask;
    // gradientColor.a *= 1. - gradient;

    gl_FragColor = gradientColor;
    // gl_FragColor = vec4(0.61, 0.45, 0.3, 1.0);    
    // gl_FragColor = finalNoise;
    // gl_FragColor = vec4(distance, 1.0, 1.0, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}
