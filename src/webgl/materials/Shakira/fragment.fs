uniform float uTime;
uniform float uNoiseScale;
uniform float uNoiseStrength;
uniform sampler2D uTexture;
uniform sampler2D uTextureShake;
uniform sampler2D uPerlin;
uniform vec2 uOffset;
uniform vec3 uBoundingSize;
uniform vec3 uCameraPosition;
uniform vec3 uWorldPosition;
uniform vec3 uColor;

varying vec2 vUv;
varying vec4 vPosition;
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
	// vec3 worldPosition = vViewPosition + uCameraPosition;
	float dist = distance((uCameraPosition), (uWorldPosition)) / 100.;
	float invertedDist = (1. - dist * 3.) * 5.;

	float maxValue = 10000.;
	float minValue = 100.;
	float ratio = clamp(uBoundingSize.x * uBoundingSize.y * uBoundingSize.z, minValue, maxValue);
	float ratioStrength = 100.;

	if(ratio > 500. && dist < 0.12) {
		ratioStrength = 20.;
	}

	if(ratio < 500.) {
		ratioStrength = 5.;
	}

	vec4 noise = texture2D(uPerlin, vUv * 100.);
	vec2 scaledUv = vUv * ratio / ratioStrength;
	vec2 displacedUv = ((scaledUv + uOffset / 100.0) * uNoiseScale);

	vec4 textureColor = texture2D(uTexture, vUv);
	if(textureColor.r == 0. && textureColor.g == 0. && textureColor.b == 0.) {
		textureColor = vec4(uColor, 1.0);
	}
	vec4 shakeTexture = texture2D(uTextureShake, displacedUv);

	vec3 color = blendOverlay(textureColor.rgb, shakeTexture.rgb, uNoiseStrength);

	gl_FragColor = vec4(color, 1.0);

	// gl_FragColor = shakeTexture;
	// gl_FragColor = vec4(vec3(invertedDist), 1.0);
}