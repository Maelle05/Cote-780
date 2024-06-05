import {
  Mesh,
  PlaneGeometry,
} from "three";
import gsap from "gsap";
import { state } from "@/utils/State";
import { app } from "@/App";
import { SpiritMaterial } from "../materials/Spirit/material";
import { Vector2 } from "three";

export default class Spirit extends Mesh {
  constructor() {
    super();
    state.register(this)

    this.config = {
      dotsNumber: 11,
      dotsBaseRadius: window.innerHeight * .1,
      tailSpring: .35,
      tailGravity: window.innerHeight * .005,
      tailGravityBonds: [window.innerHeight * .005, window.innerHeight * .01],
      tailFriction: .5,
      faceExpression: 0,
      catchingSpeed: window.innerWidth * .0001,
    };

    this.geometry = this.#createGeometry();
    this.material = this.#createMaterial();

    gsap.to(this.position, {
      x: 0.5,
      ease: 'power2.inOut',
      duration: 3,
      repeat: -1,
      yoyo: true,
    })
  }

  show() {
    gsap.fromTo(
      this.scale,
      {
        x: 0,
        y: 0,
        z: 0,
      },
      {
        x: 1,
        y: 1,
        z: 1,
        duration: 0.2,
        ease: "power2.in",
      }
    );
  }

  hide() {
    gsap.to(this.scale, {
      x: 0,
      y: 0,
      z: 0,
      duration: 0.2,
    });
  }

  #createGeometry() {
    const geometry = new PlaneGeometry(0.5, 0.5);
    return geometry;
  }

  #createMaterial() {
    const material = new SpiritMaterial({
        uniforms: {
          u_touch_texture: {type: 't', value: this.touchTexture},
          u_mouse: { type: 'v2', value: new Vector2(0, 0) },
          u_target_mouse: { type: 'v2', value: new Vector2(0, 0) },
          u_resolution: { type: 'v2', value: new Vector2(0, 0) },
          u_time: { type: 'f', value: 0 },
          u_face_expression: { type: 'f', value: this.config.faceExpression },
          u_ratio: { type: 'f', value: window.innerWidth / window.innerHeight },
        }
      });
    return material;
  }

  onTick(){
    this.lookAt(app.webgl.camera.position)

    this.material.uniforms.u_time.value = app.ticker.elapsed * 0.001
  }
}
