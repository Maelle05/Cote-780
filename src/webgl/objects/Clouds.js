import { app } from "@/App";
import { state } from "@/utils/State";
import { AdditiveBlending, BufferGeometry, Float32BufferAttribute, Group, Points, Vector3 } from "three";
import { CloudMaterial } from "../materials/Cloud/material";

export default class Clouds extends Group {
  cloudsCount = 5;

  speed = 0.05;
  progress = 0;
  time = 0;

  constructor(startPos, endPos) {
    super();
    state.register(this);
  
    this.startPos = startPos;
    this.endPos = endPos;
  }

  onAttach() {
    this.geometry = this.createGeometry();
    this.material = this.createMaterial();

    this.mesh = new Points(this.geometry, this.material);
    this.mesh.frustumCulled = false;
    this.add(this.mesh);
  }

  createGeometry() {
    const positionsArray = new Float32Array(this.cloudsCount * 3);

    const frameOffset = [0, 1, 2, 3, 4];
    const cloudScale = [1, 0.8, 0.7, 0.6, 0.8];
    const cloudOffset = [
      0.0, 0.0,
      -3.0, -0.5,
      -6.0, -0.5,
      -10.0, -0.5,
      -13.0, -0.5,
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
      "cloudScale",
      new Float32BufferAttribute(cloudScale, 1)
    );
    geometry.setAttribute(
      "cloudOffset",
      new Float32BufferAttribute(cloudOffset, 2)
    );

    return geometry;
  }

  createMaterial() {
    const material = new CloudMaterial({
      uniforms: {
        uTexture: { value: app.assetsManager.get("clouds") },
        uTime: { value: 0 },
        uColor: { value: new Vector3(255 / 255, 185 / 255, 138 / 255) },
      },
      transparent: true,
      blending: AdditiveBlending,
    });

    return material;
  }

  onTick({ dt }) {
    this.progress += this.speed * dt;
    this.progress %= 1;

    this.mesh.position.lerpVectors(this.startPos, this.endPos, this.progress);
    this.mesh.position.y -= 1;

    this.time += dt;

    this.material.uniforms.uTime.value = this.time;
  }
}
