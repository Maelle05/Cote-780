uniform sampler2D uTexture;
uniform float uRandom;

varying float vLife;
varying float vIndex;

float exponentialOut(float t) {
  return t == 1.0 ? t : 1.0 - pow(2.0, -10.0 * t);
}

vec2 rotateUV(vec2 uv, float rotation, vec2 mid)
{
  return vec2(
    cos(rotation) * (uv.x - mid.x) + sin(rotation) * (uv.y - mid.y) + mid.x,
    cos(rotation) * (uv.y - mid.y) - sin(rotation) * (uv.x - mid.x) + mid.y
  );
}

void main() {
    float alpha = 1. - vLife;
    if (vLife < 0.7) {
        alpha = exponentialOut(alpha);
    } else {
        alpha = sin(alpha * 10. * 3.14) * .3;
    }

    float random = uRandom;
    random = random * 2. - 1.;

    vec2 uv = gl_PointCoord;
    uv = rotateUV(uv, vLife * random * vIndex * 3.14, vec2(0.5));

    vec4 texture = texture2D(uTexture, uv);

    gl_FragColor = vec4(texture.rgb, alpha);
}