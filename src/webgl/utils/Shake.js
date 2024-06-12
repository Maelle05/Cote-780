import { Vector2 } from "three";
import { ShakiraMaterial } from "../materials/Shakira/material";
import { state } from "@/utils/State";
import { DEV_MODE } from "@/utils/constants/config";
import { Pane } from "tweakpane";

export class Shake {
  constructor() {
    state.register(this);
    this.shakes = [];
    this.elapsedTime = 0;
    this.dancing = false;

    this.PARAMS = {
      shakeFrequency: 0.3,
      shakeOffset: 0.8,
      shakeRandomRange: 0.2,
    };

    // this.debug();
  }

  debug() {
    if (DEV_MODE) {
      this.pane = new Pane({ title: "ShakeParam", expanded: true });

      this.pane.addBinding(this.PARAMS, "shakeFrequency", {
        min: 0,
        max: 1,
        step: 0.001,
      });

      this.pane.addBinding(this.PARAMS, "shakeOffset", {
        min: 0,
        max: 0.5,
        step: 0.001,
      });

      this.pane.addBinding(this.PARAMS, "shakeRandomRange", {
        min: 0,
        max: 2,
        step: 0.001,
      });
    }
  }

  initShake(scene) {
    scene.traverse((child) => {
      if (child.isMesh && child.name.includes("-Shakira")) {
        child.material = new ShakiraMaterial({
          uniforms: {
            uTexture: { value: child.material.map },
            uTime: { value: 0 },
            uOffset: { value: new Vector2() },
          },
        });

        this.shakes.push(child);
      }
    });
  }

  onTick(e) {
    if (!this.dancing) return;
    this.elapsedTime += e.dt;

    if (this.shakes && this.elapsedTime > this.PARAMS.shakeFrequency) {
      this.shakes.forEach((plane) => {
        plane.material.uniforms.uOffset.value = this.#getRandomOffset(
          this.PARAMS.shakeOffset,
          this.PARAMS.shakeRandomRange
        );
      });

      this.elapsedTime = 0;
    }
  }

  #getRandomOffset(value, interval) {
    const max = value + interval;
    const min = value - interval;

    const randomX = Math.random() * (max - min) + min;
    const randomY = Math.random() * (max - min) + min;

    return new Vector2(randomX, randomY);
  }

  startShake() {
    // this.dancing = true;
  }

  stopShake() {
    this.dancing = false;
  }
}
