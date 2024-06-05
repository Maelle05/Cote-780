import { Mesh, PlaneGeometry, MeshBasicMaterial, DoubleSide } from "three";
import { FoamMaterial } from "../materials/Foam/material";
import { Vector3 } from "three";
import { state } from "../../utils/State";
import { app } from "@/App";
import { AnimManager } from "../utils/AnimManager";

export default class Milo {
  constructor() {
    state.register(this);

    this.milo = app.assetsManager.get("milo_anim");
    this.milo.anims = new AnimManager(this.milo);
  }

  onTick(e) {
    // this.material.uniforms.uTime.value = e.et / 1000;
  }
}
