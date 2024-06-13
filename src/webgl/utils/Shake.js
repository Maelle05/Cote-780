import { RepeatWrapping, Vector2, Vector3 } from "three";
import { ShakiraMaterial } from "../materials/Shakira/material";
import { state } from "@/utils/State";
import { DEV_MODE } from "@/utils/constants/config";
import { Pane } from "tweakpane";
import { app } from "@/App";
import { Box3 } from "three";

export class Shake {
  constructor() {
    state.register(this);
    this.shakes = [];
    this.elapsedTime = 0;
    this.dancing = false;

    this.PARAMS = {
      shakeFrequency: 0.3,
      shakeOffset: 0.8,
      shakeRandomRange: 5,
      shakeNoiseScale: 0.2,
      shakeNoiseStrength: 0.05,
    };

    this.debug();
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
        max: 10,
        step: 0.001,
      });

      this.pane.addBinding(this.PARAMS, "shakeRandomRange", {
        min: 0,
        max: 10,
        step: 0.001,
      });

      this.pane.addBinding(this.PARAMS, "shakeNoiseScale", {
        min: 0,
        max: 6,
        step: 0.01,
      });

      this.pane.addBinding(this.PARAMS, "shakeNoiseStrength", {
        min: 0.01,
        max: 0.5,
        step: 0.001,
      });
    }
  }

  onAttach() {}

  initShake(scene) {
    this.noiseTexture = app.assetsManager.get("shakeNoise");
    this.noiseTexture.wrapS = RepeatWrapping;
    this.noiseTexture.wrapT = RepeatWrapping;

    this.perlinTexture = app.assetsManager.get("spiritNoise");
    this.perlinTexture.wrapS = RepeatWrapping;
    this.perlinTexture.wrapT = RepeatWrapping;

    scene.traverse((child) => {
      if (
        (child.isMesh && child.name.includes("-Shakira")) ||
        child.name.includes("Plane002")
      ) {
        const bounding = new Box3().setFromObject(child);
        const boundingSize = bounding.getSize(new Vector3());

        child.material = new ShakiraMaterial({
          uniforms: {
            uTexture: { value: child.material.map },
            uTextureShake: { value: this.noiseTexture },
            uPerlin: { value: this.perlinTexture },
            uTime: { value: 0 },
            uOffset: { value: new Vector2() },
            uBoundingSize: { value: boundingSize },
            uNoiseScale: { value: 10 },
            uNoiseStrength: { value: 10 },
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

        plane.material.uniforms.uNoiseScale.value = this.PARAMS.shakeNoiseScale;
        plane.material.uniforms.uNoiseStrength.value =
          this.PARAMS.shakeNoiseStrength;
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
    this.dancing = true;
  }

  stopShake() {
    this.dancing = false;
  }
}
