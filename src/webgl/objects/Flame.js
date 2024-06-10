import {
  Mesh,
  PlaneGeometry,
  MeshBasicMaterial,
  DoubleSide,
  SphereGeometry,
} from "three";
import gsap from "gsap";
import { Vector3 } from "three";
import { InstancedBufferGeometry } from "three";
import { Vector2 } from "three";
import { InstancedBufferAttribute } from "three";
import { app } from "@/App";
import { FlameMaterial } from "../materials/Flame/material";
import { state } from "../../utils/State";

export default class Flame extends Mesh {
  constructor() {
    super();
    state.register(this);

    this.count = 100;
    this.resolution = new Vector2(app.viewport.width, app.viewport.height);
    this.time = 0;
    this.objectScale = { value: 0 };
    this.maxRadius = 0.15;
    this.texture = app.assetsManager.get("flamme");

    this.geometry = this.#createGeometry();
    this.material = this.#createMaterial();
  }

  #createGeometry() {
    // const geometry = new SphereGeometry(0.04, 20, 20);
    // const instancedGeometry = new InstancedBufferGeometry().copy(geometry);
    // instancedGeometry.instanceCount = this.count;

    // // instance specific attributes
    // const positions = new Float32Array(this.count * 3);
    // const sizes = new Float32Array(this.count);
    // const speed = new Float32Array(this.count);

    // for (let i = 0; i < this.count; i++) {
    //   const i3 = i * 3;
    //   const angle = (i / this.count) * Math.PI * 2;
    //   const radius = Math.sqrt(Math.random()) * this.maxRadius;

    //   positions[i3] = Math.cos(angle) * radius;
    //   positions[i3 + 1] = 0;
    //   positions[i3 + 2] = Math.sin(angle) * radius;

    //   sizes[i] = Math.random() * 0.2;
    //   speed[i] = Math.random() * 0.5 + 0.5;
    // }

    // instancedGeometry.setAttribute(
    //   "instancePosition",
    //   new InstancedBufferAttribute(positions, 3)
    // );
    // instancedGeometry.setAttribute(
    //   "aSize",
    //   new InstancedBufferAttribute(sizes, 1)
    // );
    // instancedGeometry.setAttribute(
    //   "aSpeed",
    //   new InstancedBufferAttribute(speed, 1)
    // );
    // return instancedGeometry;

    const geometry = new PlaneGeometry(0.12, 0.12, 1, 1);

    return geometry;
  }

  #createMaterial() {
    const offset = Math.random() * 3;
    const material = new FlameMaterial({
      uniforms: {
        uSize: { value: this.particleSize },
        uResolution: { value: this.resolution },
        uTime: { value: this.time },
        uScale: { value: this.objectScale.value },
        uTexture: { value: this.texture },
        uOffset: { value: offset },
      },
      transparent: true,
    });

    return material;
  }

  onTick(e) {
    this.material.uniforms.uTime.value = e.et / 1000;
    this.lookAt(app.webgl.camera.position);
  }

  show() {
    gsap.to(this.material.uniforms.uScale, {
      value: 1,
      duration: 0.5,
      ease: "power1.out",
    });
  }

  hide() {
    gsap.to(this.material.uniforms.uScale, {
      value: 0,
      duration: 0.5,
      ease: "power1.in",
    });
  }
}
