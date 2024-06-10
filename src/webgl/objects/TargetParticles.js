import {
  Mesh,
  PlaneGeometry,
  MeshBasicMaterial,
  DoubleSide,
  AdditiveBlending,
} from "three";
import { BufferGeometry } from "three";
import { Float32BufferAttribute } from "three";
import { PointsMaterial } from "three";
import { Points } from "three";
import { Uniform } from "three";
import { Vector2 } from "three";
import { TargetParticlesMaterial } from "@/webgl/materials/TargetParticles/material";
import gsap from "gsap";
import { Vector3 } from "three";
import { app } from "@/App";

export default class TargetParticles extends Points {
  constructor(count, position, size, nextRockPos) {
    super();

    // console.log(this.webgl);

    this.count = count;
    this.position.copy(position);
    this.nextRockPos = nextRockPos;
    this.directionalVector = new Vector3();
    this.dir1 = this.directionalVector
      .subVectors(nextRockPos, position)
      .normalize();

    this.dir2 = this.directionalVector.subVectors(position, nextRockPos);

    this.particleSize = 0.002;
    this.resolution = new Vector2(app.viewport.width, app.viewport.height);
    this.radius = 0.05;
    this.progress = 0;
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
    // console.log("createa this : " + this.position.x);
    // console.log("create Next : " + this.nextRockPos.x);

    this.p1 = this.calculatePointRadiusDirection(
      this.position,
      this.radius,
      this.dir1
    );

    this.p2 = this.calculatePointRadiusDirection(
      this.nextRockPos,
      this.radius + 0.2,
      this.dir2
    );

    this.p1 = new Vector3().subVectors(this.p1, this.position);
    // this.p2 = this.p2.subVectors(this.p2, this.nextRockPos);
    this.p2 = new Vector3().subVectors(this.p2, this.position);
    this.p3 = new Vector3().subVectors(this.nextRockPos, this.position);
    this.p4 = new Vector3().subVectors(this.nextRockPos, this.position);
    this.p2.y -= 0.2;
    this.p3.y -= 0.2;

    // Material
    const material = new TargetParticlesMaterial({
      uniforms: {
        uSize: { value: this.particleSize },
        uResolution: { value: this.resolution },
        uProgress: { value: this.progress },
        uTime: { value: this.time },
        uRadius: { value: this.radius },
        uP1: { value: this.p1 },
        uP2: { value: this.p2 },
        uP3: { value: this.p3 },
        uP4: { value: this.p4 },
        uNoiseOffset: { value: 2 },
      },
    });

    return material;
  }

  calculatePos(position, nextRockPos) {
    // this.newPos = position;
    console.log("position : " + position.x);
    console.log("Next : " + nextRockPos.x);
    // this.nextRockPos = nextRockPos;
    this.progress = 0;

    this.p1 = this.calculatePointRadiusDirection(
      this.position,
      this.radius,
      this.dir1
    );

    this.p2 = this.calculatePointRadiusDirection(
      nextRockPos,
      this.radius + 0.2,
      this.dir2
    );

    this.p1 = new Vector3().subVectors(this.p1, this.position);
    // this.p2 = this.p2.subVectors(this.p2, nextRockPos);
    this.p2 = new Vector3().subVectors(this.p2, this.position);
    this.p3 = new Vector3().subVectors(nextRockPos, this.position);
    this.p4 = new Vector3().subVectors(nextRockPos, this.position);
    this.p2.y -= 0.2;
    this.p3.y -= 0.2;

    this.material.uniforms.uP1.value = this.p1;
    this.material.uniforms.uP2.value = this.p2;
    this.material.uniforms.uP3.value = this.p3;
    this.material.uniforms.uP4.value = this.p4;
    this.material.uniforms.uProgress.value = this.progress;
  }

  next(duration) {
    gsap.to(this.material.uniforms.uProgress, {
      value: 1,
      duration: duration,
      // ease: "power2.in",
    });
  }

  resize() {
    this.resolution.set(
      app.viewport.width * Math.min(window.devicePixelRatio, 2),
      app.viewport.height * Math.min(window.devicePixelRatio, 2)
    );
  }

  calculatePointRadiusDirection(center, r, dir) {
    // Destructure the input arrays for better readability
    const [Bx, By, Bz] = center;
    const [vx, vy, vz] = dir;

    // Scale the normalized vector by the radius R
    const wx = r * vx;
    const wy = r * vy;
    const wz = r * vz;

    // Calculate point A by adding the scaled vector to point B
    const Ax = Bx + wx;
    const Ay = By + wy;
    const Az = Bz + wz;

    // Return the coordinates of point A
    return new Vector3(Ax, Ay, Az);
  }
}
