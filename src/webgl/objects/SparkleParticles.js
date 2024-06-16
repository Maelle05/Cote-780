import { Group } from "three";
import { BufferGeometry } from "three";
import { Float32BufferAttribute } from "three";
import { Points } from "three";
import { Vector2 } from "three";
import { SparkleParticlesMaterial } from "@/webgl/materials/SparkleParticles/material";
import { Vector3 } from "three";
import { app } from "@/App";
import { state } from "@/utils/State";
import { AdditiveBlending } from "three";

export default class SparkleParticles extends Group {
  poolInactives = [];
  poolActives = [];
  count = 20;
  lifetime = 1000;

  constructor() {
    super();
    state.register(this);

    this.particleSize = 0.2;
    this.resolution = new Vector2(app.viewport.width, app.viewport.height);
    this.radius = 0.05;
    this.progress = 0;
    this.time = 0;
  }

  onAttach() {
    this.geometry = this.#createGeometry();
    this.material = this.#createMaterial();
  }

  #createGeometry() {
    const positionsArray = new Float32Array(this.count * 3);

    const particleIndices = new Float32Array(this.count);
    const particleRandom = new Float32Array(this.count);
    for (let i = 0; i < this.count; i++) {
      particleIndices[i] = i / this.count;
      particleRandom[i] = Math.random();
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
    geometry.setAttribute(
      "particleRandom",
      new Float32BufferAttribute(particleRandom, 1)
    );

    return geometry;
  }

  #createMaterial() {
    const material = new SparkleParticlesMaterial({
      uniforms: {
        uTexture: { value: app.assetsManager.get("sparkle") },
        uSize: { value: this.particleSize },
        uBirth: { value: 0 },
        uLifetime: { value: this.lifetime },
        uRandom: { value: Math.random() },
        uTime: { value: this.time },
      },
      transparent: true,
      blending: AdditiveBlending,
    });

    return material;
  }

  createPoints() {
    const points = new Points(this.geometry, this.material);

    this.add(points);
    this.poolInactives.push(points);
  }

  spawn(position) {
    const particle = this.poolInactives.pop() || new Points(this.geometry, this.material.clone());

    particle.material.uniforms.uBirth.value = app.ticker.elapsed;
    particle.material.uniforms.uRandom.value = Math.random() * .5 + .5;
    particle.position.copy(position);

    this.add(particle);
    this.poolActives.push(particle);
  }
  
  onTick() {
    this.poolActives.concat(this.poolInactives).forEach((particle) => {
      particle.material.uniforms.uTime.value = app.ticker.elapsed;
    });

    this.poolActives.forEach((particle, index) => {
      if (app.ticker.elapsed - particle.material.uniforms.uBirth.value > this.lifetime) {
        this.poolActives.splice(index, 1);
        this.poolInactives.push(particle);
        this.remove(particle);
      }
    });
  }
}
