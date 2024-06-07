import {
  Mesh,
  PlaneGeometry,
  RepeatWrapping,
} from "three";
import gsap from "gsap";
import { state } from "@/utils/State";
import { app } from "@/App";
import { SpiritFaceMaterial } from "../materials/Spirit/Face/material";
import { SpiritBodyMaterial } from "../materials/Spirit/Body/material";
import { Vector2 } from "three";
import { Group } from "three";

export default class Spirit extends Group {
  constructor() {
    super();
    state.register(this)

    this.config = {
      faceExpression: 0,
    };

    // Face
    const noise = app.assetsManager.get('spiritNoise');
    noise.wrapS = RepeatWrapping
    noise.wrapT = RepeatWrapping
    this.faceGeometry = new PlaneGeometry(0.25, 0.25);
    this.faceMaterial = new SpiritFaceMaterial({
      uniforms: {
        u_time: { value: 0 },
        u_move: { value: 0 },
        u_faceMask: { value: app.assetsManager.get('spiritFace')},
        u_texture: { value: app.assetsManager.get('spiritTex')},
        u_noise: { value: noise},
      }
    });
    this.face = new Mesh(this.faceGeometry, this.faceMaterial);
    this.add(this.face)

    this.bodyGeometry = new PlaneGeometry(0.25, 0.25);
    this.bodyMaterial = new SpiritBodyMaterial({
      uniforms: {
        u_time: { value: 0 },
        u_move: { value: 0 },
        u_faceMask: { value: app.assetsManager.get('spiritBody')},
        u_texture: { value: app.assetsManager.get('spiritTex')},
        u_noise: { value: noise},
      }
    });
    this.body = new Mesh(this.bodyGeometry, this.bodyMaterial);
    this.body.position.x = 0.01;
    this.body.position.y = -0.2;
    this.body.position.z = -0.01;
    this.add(this.body)

    gsap.to(this.position, {
      x: 0.5,
      ease: 'power2.inOut',
      duration: 3,
      repeat: -1,
      yoyo: true,
    })

    

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

  onTick(){
    this.lookAt(app.webgl.camera.position)

    if(this.faceMaterial){
      this.faceMaterial.uniforms.u_time.value = app.ticker.elapsed * 0.001
      this.bodyMaterial.uniforms.u_time.value = app.ticker.elapsed * 0.001
      const move = this.valueMove(this.position.x)
      this.faceMaterial.uniforms.u_move.value = move
      this.bodyMaterial.uniforms.u_move.value = move
    }
  }

  valueMove(currentPos){
    let strength = 0
    if (currentPos != this.lastPos) {
      const diff = (currentPos - this.lastPos) * 20
      strength = (diff > 1) ? 1 : (diff < -1) ? -1 : diff
      strength = -strength
      this.lastPos = currentPos
    }

    return strength // entre -1 et 1
  }
}
