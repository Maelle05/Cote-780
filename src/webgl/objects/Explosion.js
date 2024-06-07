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
import { state } from "@/utils/State";

export default class Explosion extends Mesh {
  constructor(spritesheet, data) {
    super();
    state.register(this);

    this.size = data.meta.size;
    this.frameOrder = Object.values(data.animations);
    this.frames = data;
    this.frameSize = frames[framesOrder[0]].sourceSize;
    this.spritesheet = spritesheet;

    this.position.copy(position);
    this.resolution = new Vector2(app.viewport.width, app.viewport.height);

    this.geometry = this.#createGeometry();
    this.material = this.#createMaterial();
  }

  #createGeometry() {
    const geometry = new PlaneGeometry(1, 1, 1, 1);

    return geometry;
  }

  #createMaterial() {
    // Material
    const material = new FireworkMaterial({
      uniforms: {
        tSpritesheet: { value: this.spritesheet },
        uOffset: { value: new Vector2() },
        uSize: {
          value: new Vector2(
            this.frameSize.frameWidth / this.size.width,
            this.frameSize.frameHeight / this.size.height
          ),
        },
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
