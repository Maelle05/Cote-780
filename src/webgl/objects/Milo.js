import { Mesh, PlaneGeometry, MeshBasicMaterial, DoubleSide } from "three";
import { FoamMaterial } from "../materials/Foam/material";
import { Vector3 } from "three";
import { state } from "../../utils/State";
import { app } from "@/App";
import { AnimManager } from "../utils/AnimManager";
import gsap from "gsap";

export default class Milo {
  static instance = null;
  constructor() {
    if (Milo.instance) {
      return Milo.instance;
    }

    state.register(this);

    this.model = app.assetsManager.get("milo_anim");
    this.model.scale.set(0.07, 0.07, 0.07);
    this.model.goTo = this.goTo;
    this.model.anims = new AnimManager(this.model);

    Milo.instance = this;
  }

  static getInstance() {
    if (!Milo.instance) {
      Milo.instance = new Milo();
    }
    return Milo.instance;
  }

  onTick(e) {
    // this.material.uniforms.uTime.value = e.et / 1000;
  }

  goTo = (finalPos, duration, rotation) => {
    const tl = gsap.timeline();

    //Play Anim Walk
    this.model.anims.walk();
    this.model.lookAt(finalPos);

    tl.to(this.model.position, {
      x: finalPos.x,
      y: finalPos.y,
      z: finalPos.z,
      delay: 0.2,
      duration: duration,
      ease: "linear",
      onComplete: () => {
        //Play Anim Idle
        this.model.anims.idle();
      },
    });

    tl.call(
      () => {
        this.model.anims.idle();
      },
      [],
      duration - 0.2
    );

    if (rotation) {
      tl.to(
        this.model.rotation,
        {
          y: rotation,
          duration: 1,
          ease: "linear",
        },
        `-=${0.5}`
      );
    }
  };

  clone() {
    let clone = this.model.clone();
    clone.anims = this.model.anims;
    clone.name = "multiclonaaage !";

    return clone;
  }
}
