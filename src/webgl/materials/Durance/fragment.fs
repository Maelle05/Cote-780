uniform float uProgress;
uniform sampler2D uBaseTex;
varying vec2 vUv;
varying float vElevation;

void main() {
  vec4 baseTex = texture2D(uBaseTex, vUv);

  float mask = smoothstep(0., 0.12, vElevation);

  vec4 final = mix(vec4(0.), baseTex, mask);

  gl_FragColor = final;
}