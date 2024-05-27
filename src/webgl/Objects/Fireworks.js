import { Mesh, PlaneGeometry, MeshBasicMaterial, DoubleSide } from "three";
import { TestPlaneMaterial } from "../Materials/TestPlane/material";
import { BufferGeometry } from "three";
import { Float32BufferAttribute } from "three";
import { PointsMaterial } from "three";
import { Points } from "three";
import { FireworkMaterial } from "../Materials/Firework/material";
import { Uniform } from "three";
import WebglController from "../WebglController";
import { Vector2 } from "three";

export default class Fireworks extends Points {
  constructor(count, position, size) {
    super();

    this.webgl = new WebglController();

    // console.log(this.webgl);

    this.count = count;
    this.position.copy(position);
    this.particleSize = size;
    this.resolution = new Vector2(
      this.webgl.viewport.width,
      this.webgl.viewport.height
    );

    this.geometry = this.#createGeometry();
    this.material = this.#createMaterial();
  }

  #createGeometry() {
    const positionsArray = new Float32Array(this.count * 3);
    for (let i = 0; i < this.count; i++) {
      const i3 = i * 3;

      positionsArray[i3] = Math.random() - 0.5;
      positionsArray[i3 + 1] = Math.random() - 0.5;
      positionsArray[i3 + 2] = Math.random() - 0.5;
    }

    const geometry = new BufferGeometry();
    geometry.setAttribute(
      "position",
      new Float32BufferAttribute(positionsArray, 3)
    );

    return geometry;
  }

  #createMaterial() {
    // Material
    const material = new FireworkMaterial({
      uniforms: {
        uSize: { value: this.particleSize },
        uResolution: { value: this.resolution },
      },
    });

    return material;
  }

  resize() {
    this.resolution.set(
      this.webgl.viewport.width * Math.min(window.devicePixelRatio, 2),
      this.webgl.viewport.height * Math.min(window.devicePixelRatio, 2)
    );
  }
}
