uniform float uTime;
uniform float uOffset;
uniform sampler2D uTexture;

varying vec2 vUv;
varying vec3 vPosition;
varying float vSize;
varying float vSpeed;
varying float vElevation;

float PI = 3.141592653589793238;

void main() {
    vec2 distortedUv = vUv;
    float distortion = sin((vUv.x) * 10.0 + uTime * 3.0 + uOffset) * 0.4 * vUv.y;

    //Avoid texture's top cut
    distortion *= smoothstep(0.0, 1.0, 1.0 - vUv.y);
    distortedUv.y += distortion;

    vec4 textureColor = texture2D(uTexture, distortedUv);

    gl_FragColor = textureColor;    
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}