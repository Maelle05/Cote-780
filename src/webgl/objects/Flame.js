import {
  Mesh,
  PlaneGeometry,
  MeshBasicMaterial,
  DoubleSide,
  SphereGeometry,
} from "three";
import { TestPlaneMaterial } from "../materials/TestPlane/material";
import gsap from "gsap";
import { Vector3 } from "three";

export default class Flame extends Mesh {
  constructor() {
    super();

    this.geometry = this.#createGeometry();
    this.material = this.#createMaterial();
  }

  show() {
    gsap.fromTo(
      this.scale,
      {
        x: 0,
        y: 0,
        z: 0,
      },
      {
        x: 1,
        y: 1,
        z: 1,
        duration: 0.2,
        ease: "power2.in",
      }
    );
  }

  hide() {
    gsap.to(this.scale, {
      x: 0,
      y: 0,
      z: 0,
      duration: 0.2,
    });
  }

  #createGeometry() {
    const geometry = new SphereGeometry(0.04, 20, 20);
    return geometry;
  }

  #createMaterial() {
    const material = new MeshBasicMaterial({
      color: "orange",
      side: DoubleSide,
    });

    return material;
  }
}
