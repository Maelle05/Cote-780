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
      faceExpression: 0,
    };

    this.geometry = this.#createGeometry();
    this.material = this.#createMaterial();

    // gsap.to(this.position, {
    //   x: 0.5,
    //   ease: 'power2.inOut',
    //   duration: 3,
    //   repeat: -1,
    //   yoyo: true,
    // })

    // Var
    this.lastPos = 0
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
    const geometry = new PlaneGeometry(0.4, 0.4);
    return geometry;
  }

  #createMaterial() {
    const material = new SpiritMaterial({
        uniforms: {
          u_time: { value: 0 },
          u_mouve: { value: 0 },
          u_face_expression: { value: this.config.faceExpression },
        }
      });
    return material;
  }

  onTick(){
    this.lookAt(app.webgl.camera.position)

    this.material.uniforms.u_time.value = app.ticker.elapsed * 0.001
    this.material.uniforms.u_mouve.value = this.valueMove(this.position.x)
  }

  valueMove(currentPos){
    let strength = 0

    if (currentPos != this.lastPos) {
      const diff = (currentPos - this.lastPos) * 40
      strength = (diff > 1) ? 1 : (diff < -1) ? -1 : diff
      strength = -strength
      this.lastPos = currentPos
    }

    return strength // entre -1 et 1
  }
}
