import { app } from "@/App";
import { state } from "@/utils/State";
import { BufferGeometry, Float32BufferAttribute, Group, Points, Vector3 } from "three";
import { BirdMaterial } from "../materials/Bird/material";

export default class Birds extends Group {
  birdsCount = 5;

  speed = 0.1;
  progress = 0;
  frameRate = 10;
  time = 0;
  currentFrame = 0;

  constructor(startPos, endPos, mirror = false) {
    super();
    state.register(this);
  
    this.startPos = startPos;
    this.endPos = endPos;
    this.mirror = mirror;
  }

  onAttach() {
    this.geometry = this.createGeometry();
    this.material = this.createMaterial();

    this.mesh = new Points(this.geometry, this.material);
    this.add(this.mesh);
  }

  createGeometry() {
    const positionsArray = new Float32Array(this.birdsCount * 3);

    const frameOffset = [0, 1, 2, 3, 4];
    const birdScale = [1, 0.8, 0.7, 0.6, 0.5];
    const birdOffset = [
      0.0, 0.0,
      0.7, 0.0,
      1.2, -0.4,
      1.7, -0.3,
      2, -0.5,
    ];

    const geometry = new BufferGeometry();

    geometry.setAttribute(
      "position",
      new Float32BufferAttribute(positionsArray, 3)
    );
    geometry.setAttribute(
      "frameOffset",
      new Float32BufferAttribute(frameOffset, 1)
    );
    geometry.setAttribute(
      "birdScale",
      new Float32BufferAttribute(birdScale, 1)
    );
    geometry.setAttribute(
      "birdOffset",
      new Float32BufferAttribute(birdOffset, 2)
    );

    return geometry;
  }

  createMaterial() {
    const material = new BirdMaterial({
      uniforms: {
        uTexture: { value: app.assetsManager.get("bird") },
        uFrame: { value: 0 },
        uMirror: { value: this.mirror ? 1 : 0 },
        uTime: { value: 0 },
        uColor: { value: new Vector3(158 / 255, 146 / 255, 128 / 255) },
      },
      transparent: true,
    });

    return material;
  }

  onTick({ dt }) {
    this.progress += this.speed * dt;
    this.progress %= 1;

    this.mesh.position.lerpVectors(this.startPos, this.endPos, this.progress);

    this.currentFrame = Math.floor(this.time * this.frameRate) % 4;
    this.material.uniforms.uFrame.value = this.currentFrame;

    this.time += dt;

    this.material.uniforms.uTime.value = this.time;
  }
}
