uniform float uTime;
uniform float uNoiseScale;
uniform float uNoiseStrength;
uniform sampler2D uTexture;
uniform sampler2D uTextureShake;
uniform sampler2D uPerlin;
uniform vec2 uOffset;
uniform vec3 uBoundingSize;

varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;

float PI = 3.141592653589793238;

float blendOverlay(float base, float blend) {
	return base < 0.5 ? (2.0 * base * blend) : (1.0 - 2.0 * (1.0 - base) * (1.0 - blend));
}

vec3 blendOverlay(vec3 base, vec3 blend) {
	return vec3(blendOverlay(base.r, blend.r), blendOverlay(base.g, blend.g), blendOverlay(base.b, blend.b));
}

vec3 blendOverlay(vec3 base, vec3 blend, float opacity) {
	return (blendOverlay(base, blend) * opacity + base * (1.0 - opacity));
}

void main() {

	// float dist = distance((cameraPosition), (vPosition)) / 20.;

	float maxValue = 10000.;
	float minValue = 1000.;
	float ratio = clamp(uBoundingSize.x * uBoundingSize.y * uBoundingSize.z, minValue, maxValue);
	vec4 noise = texture2D(uPerlin, vUv * 10.);
	vec2 scaledUv = vUv * ratio / 100.;
	vec2 displacedUv = ((scaledUv + uOffset / 100.0) * uNoiseScale);

	vec4 textureColor = texture2D(uTexture, vUv);
	vec4 shakeTexture = texture2D(uTextureShake, displacedUv);

	// vec4 color = textureColor + shakeTexture * uNoiseStrength;

	vec3 color = blendOverlay(textureColor.rgb, shakeTexture.rgb, uNoiseStrength);

	gl_FragColor = vec4(color, 1.0);
	// gl_FragColor = vec4(vec3(dist), 1.0);
}