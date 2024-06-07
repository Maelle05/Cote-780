import { Mesh, PlaneGeometry, MeshBasicMaterial, DoubleSide } from "three";
import { TestPlaneMaterial } from "../materials/TestPlane/material";
import { BufferGeometry } from "three";
import { Float32BufferAttribute } from "three";
import { PointsMaterial } from "three";
import { Points } from "three";
import { FireworkMaterial } from "../materials/Firework/material";
import { Uniform } from "three";
import { Vector2 } from "three";
import { app } from "@/App";
import Explosion from "./Explosion";

export default class Fireworks {
  constructor(position) {
    // console.log(this.webgl);
    const explosionCount = 6;
    const explosionSpriteSheets = [];

    for (let i = 1; i <= explosionCount; i++) {
      const explosion = {
        spritesheet: app.assetsManager.get(`explosion` + i),
        data: app.assetsManager.get(`explosion` + i + "_data"),
      };

      explosionSpriteSheets.push(explosion);
    }

    const explosion = new Explosion(explosionSpriteSheets[0]);

    // this.position.copy(position);
    this.resolution = new Vector2(app.viewport.width, app.viewport.height);

    // this.geometry = this.#createGeometry();
    // this.material = this.#createMaterial();

    return explosion;
  }

  #createGeometry() {
    const geometry = new PlaneGeometry(1, 1, 1, 1);

    return geometry;
  }

  #createMaterial() {
    // Material
    const material = new FireworkMaterial({
      uniforms: {
        tSpritesheet: { value: spritesheet },
        uOffset: { value: new Vector2() },
        uSize: { value: new Vector2(frameWidth / width, frameHeight / height) },
        uScale: { value: new Vector2() },
        uPosition: { value: new Vector2() },
      },
      transparent: true,
    });

    return material;
  }

  resize() {
    this.resolution.set(
      app.viewport.width * Math.min(window.devicePixelRatio, 2),
      app.viewport.height * Math.min(window.devicePixelRatio, 2)
    );
  }
}
