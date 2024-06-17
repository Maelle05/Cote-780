uniform sampler2D uTexture;
uniform vec3 uColor;

varying float vFrameOffset;

void main() {
	vec2 uv = gl_PointCoord.xy;
	if (uv.y > 0.24 || uv.y < 0.005) discard;
	uv.y = 1. - uv.y;
	uv.y += vFrameOffset * 0.25;
	uv.y = mod(uv.y, 1.);

	vec4 texture = texture2D(uTexture, uv);

	if (texture.a < 0.1) discard;

	gl_FragColor = vec4(texture.rgb * uColor, texture.a);
}