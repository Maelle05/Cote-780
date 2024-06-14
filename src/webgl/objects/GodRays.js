import { app } from "@/App";
import { state } from "@/utils/State";
import { PlaneGeometry } from "three"
import { Mesh } from "three"
import { DodRaysMaterial } from "../materials/GodRays/material";
import { Vector2 } from "three";

export default class GodRays extends Mesh {
  constructor(){
    super()
    state.register(this);

    this.geometry = new PlaneGeometry(2.2, 5)
    this.material = new DodRaysMaterial({
      transparent: true,
      uniforms: {
        iTime: { value: app.ticker.elapsed * 0.0005 },
        iResolution: { value: new Vector2(1, 1) },
        g_alpha: { value: 1. },
      },
    })
  }
  
  onTick(){
    this.lookAt(app.webgl.camera.position)

    this.material.uniforms.iTime.value = app.ticker.elapsed * 0.0005;
  }
}