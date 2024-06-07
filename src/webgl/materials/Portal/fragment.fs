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
    // gradient outside
    float edgeSize = 0.10;
    vec2 innerStart = vec2(edgeSize);
    vec2 innerEnd = vec2(1. - edgeSize);
    vec2 d = max(innerStart - vUv, vUv - innerEnd);
    float distance = max(d.x, d.y);
    float gradient = smoothstep(0.0, edgeSize, distance);

    vec2 noiseUv = vUv;
    noiseUv.y += uTime * 0.01;
    noiseUv = fract(noiseUv); // Repeat texture
    vec4 noiseColor = texture2D(uNoiseTexture, noiseUv);

    vec2 displacedUv = vUv + (noiseColor.rg - 0.5) * 0.05;
    vec4 textureColor = texture2D(uTexture, 1. - displacedUv);

    vec4 blendedColor = mix(textureColor, noiseColor, 0.1);
    vec4 gradientColor = mix(textureColor, vec4(1.0), gradient);

    gl_FragColor = gradientColor;
    // gl_FragColor = noise;
    // gl_FragColor = vec4(distance, 1.0, 1.0, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}

//V1 with a noise texture

// vec4 noiseColor = texture2D(uNoiseTexture, vUv);

//     vec2 displacedUv = vUv + (noiseColor.r * sin(uTime * 0.5) * noiseColor.g * cos(uTime * 0.5)) * 0.1;
//     vec4 textureColor = texture2D(uTexture, 1. - displacedUv);

//     vec4 blendedColor = mix(textureColor, noiseColor, 0.1);
//     vec4 gradientColor = mix(textureColor, vec4(1.0), gradient);

//     gl_FragColor = gradientColor;