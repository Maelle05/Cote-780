import { Mesh, PlaneGeometry, MeshBasicMaterial, DoubleSide } from "three";
import { TestPlaneMaterial } from "../Materials/TestPlane/material";

export default class TestPlane extends Mesh {
  constructor() {
    super();

    this.geometry = this.#createGeometry();
    this.material = this.#createMaterial();
  }

  #createGeometry() {
    const geometry = new PlaneGeometry(1, 1, 1, 1);
    return geometry;
  }

  #createMaterial() {
    const material = new TestPlaneMaterial({
      uniforms: {
        uTime: { value: 0 },
      },
    });

    // const material = new MeshBasicMaterial({color: 'red'})
    material.side = DoubleSide;
    return material;
  }
}
