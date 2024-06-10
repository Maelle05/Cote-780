import { Mesh, PlaneGeometry, MeshBasicMaterial, DoubleSide } from "three";
import { FoamMaterial } from "../materials/Foam/material";
import { Vector3 } from "three";
import { state } from "../../utils/State";
import { app } from "@/App";
import { AnimManager } from "../utils/AnimManager";

export default class Milo {
  static instance = null;
  constructor() {
    if (Milo.instance) {
      return Milo.instance;
    }

    state.register(this);

    this.model = app.assetsManager.get("milo_anim");
    this.model.scale.set(0.07, 0.07, 0.07);
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

  clone() {
    let clone = this.model.clone();
    clone.anims = this.model.anims;
    clone.name = "multiclonaaage !";

    return clone;
  }
}
