varying float vLife;

float exponentialOut(float t) {
  return t == 1.0 ? t : 1.0 - pow(2.0, -10.0 * t);
}

void main() {
    float alpha = 1. - vLife;
    if (vLife < 0.7) {
        alpha = exponentialOut(alpha);
    } else {
        alpha = sin(alpha * 10. * 3.14) * .3;
    }

    gl_FragColor = vec4(252. / 255., 232. / 255., 167. / 255., alpha); 
}