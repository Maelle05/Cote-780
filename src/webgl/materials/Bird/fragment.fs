uniform sampler2D uTexture;
uniform float uFrame;
uniform float uMirror;
uniform vec3 uColor;

varying float vFrameOffset;

vec2 rotateUV(vec2 uv, float rotation, vec2 mid)
{
  return vec2(
    cos(rotation) * (uv.x - mid.x) + sin(rotation) * (uv.y - mid.y) + mid.x,
    cos(rotation) * (uv.y - mid.y) - sin(rotation) * (uv.x - mid.x) + mid.y
  );
}

void main() {
	float frame = mod(vFrameOffset + uFrame, 4.);

	vec2 uv = gl_PointCoord.xy;
	uv = rotateUV(uv, 1.2, vec2(0.5));
	uv.x = uMirror == 1. ? 1. - uv.x : uv.x;
	uv.y = 1. - uv.y;
	uv *= 0.5;
	uv.x += 0.5 * mod(frame, 2.);
	uv.y += 0.5 * floor(frame / 2.);

	vec4 texture = texture2D(uTexture, uv);

	gl_FragColor = vec4(texture.rgb * uColor, texture.a);
}