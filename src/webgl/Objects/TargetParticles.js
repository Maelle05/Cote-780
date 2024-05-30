import { Mesh, PlaneGeometry, MeshBasicMaterial, DoubleSide } from "three";
import { BufferGeometry } from "three";
import { Float32BufferAttribute } from "three";
import { PointsMaterial } from "three";
import { Points } from "three";
import { Uniform } from "three";
import WebglController from "../WebglController";
import { Vector2 } from "three";
import { TargetParticlesMaterial } from "@/webgl/Materials/TargetParticles/material";
import gsap from "gsap";
import { Vector3 } from "three";

export default class TargetParticles extends Points {
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
    this.radius = 0.5;
    this.progress = 1;
    this.time = 0;

    this.geometry = this.#createGeometry();
    this.material = this.#createMaterial();
  }

  #createGeometry() {
    const positionsArray = new Float32Array(this.count * 3);

    const particleIndices = new Float32Array(this.count);
    for (let i = 0; i < this.count; i++) {
      particleIndices[i] = i / this.count;
    }

    const geometry = new BufferGeometry();

    geometry.setAttribute(
      "position",
      new Float32BufferAttribute(positionsArray, 3)
    );
    geometry.setAttribute(
      "particleIndex",
      new Float32BufferAttribute(particleIndices, 1)
    );

    return geometry;
  }

  #createMaterial() {
    // Material
    const material = new TargetParticlesMaterial({
      uniforms: {
        uSize: { value: this.particleSize },
        uResolution: { value: this.resolution },
        uProgress: { value: this.progress },
        uTime: { value: this.time },
      }
    });

    return material;
  }

  hide() {
    gsap.to(this, {
      progress: 1,
      duration: 1,
      ease: "power2.in",
      onUpdate: () => {
        this.material.uniforms.uProgress.value = this.progress;
      },
    });
  }

  show(position) {
    this.position.copy(position);

    gsap.to(this, {
      progress: 0,
      duration: 1,
      ease: "power2.out",
      onUpdate: () => {
        this.material.uniforms.uProgress.value = this.progress;
      },
    });
  }

  resize() {
    this.resolution.set(
      this.webgl.viewport.width * Math.min(window.devicePixelRatio, 2),
      this.webgl.viewport.height * Math.min(window.devicePixelRatio, 2)
    );
  }
}
