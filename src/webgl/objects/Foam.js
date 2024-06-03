import { Mesh, PlaneGeometry, MeshBasicMaterial, DoubleSide } from "three";
import { FoamMaterial } from "../materials/Foam/material";
import { Vector3 } from "three";
import { state } from "../../utils/State";

export default class Foam extends Mesh {
  constructor() {
    super();
    state.register(this);

    this.geometry = this.#createGeometry();
    this.material = this.#createMaterial();
  }

  #createGeometry() {
    const geometry = new PlaneGeometry(0.5, 0.5, 1, 1);
    return geometry;
  }

  #createMaterial() {
    const material = new FoamMaterial({
      uniforms: {
        uTime: { value: 0 },
      },
    });

    // const material = new MeshBasicMaterial({color: 'red'})
    material.side = DoubleSide;
    material.transparent = true;
    return material;
  }

  onTick(e) {
    this.material.uniforms.uTime.value = e.et / 1000;
  }
}
