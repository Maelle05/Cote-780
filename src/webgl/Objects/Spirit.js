import {
  Mesh,
  PlaneGeometry,
  MeshBasicMaterial,
  DoubleSide,
  SphereGeometry,
} from "three";
import { TestPlaneMaterial } from "../Materials/TestPlane/material";
import gsap from "gsap";
import { Vector3 } from "three";

export default class Spirit extends Mesh {
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
        duration: 0.5,
        ease: "power2.in",
      }
    );
  }

  hide() {
    gsap.to(this.scale, {
      x: 0,
      y: 0,
      z: 0,
      duration: 0.5,
    });
  }

  #createGeometry() {
    const geometry = new SphereGeometry(0.03, 20, 20);
    return geometry;
  }

  #createMaterial() {
    const material = new MeshBasicMaterial({
      color: 0xffffff,
      side: DoubleSide,
    });

    return material;
  }
}
