import { Mesh, PlaneGeometry, MeshBasicMaterial, DoubleSide } from "three";
import { TestPlaneMaterial } from "../materials/TestPlane/material";
import { BufferGeometry } from "three";
import { Float32BufferAttribute } from "three";
import { PointsMaterial } from "three";
import { Points } from "three";
import { FireworkMaterial } from "../materials/Firework/material";
import { Uniform } from "three";
import { Vector2 } from "three";
import { app } from "@/App";
import Explosion from "./Explosion";
import { SpritesheetPlayer } from "../utils/SpritesheetPlayer";
import { Group } from "three";
import gsap from "gsap";
import { state } from "@/utils/State";
import { Color } from "three";

export default class Fireworks {
  constructor(positions) {
    state.register(this);
    const explosionCount = 6;
    this.launchers = [];
    this.explosions = [];

    for (let i = 1; i <= explosionCount; i++) {
      //Create explosion mesh
      const explosion = this.#createExplosion(
        new SpritesheetPlayer("explosion" + i),
        "explosion" + i
      );

      this.explosions.push(explosion);
    }

    for (let i = 0; i < positions.length; i++) {
      //Create launch mesh
      const mesh = this.#createMesh();
      mesh.position.copy(positions[i]);
      mesh.rotation.x = -Math.PI / 2;
      mesh.lookAt(app.webgl.camera.position);

      this.launchers.push(mesh);
    }

    this.clonedExplosions = [...this.explosions];
    this.clonedLaunchers = [...this.launchers];

    this.startFirework();

    return {
      launchers: this.launchers,
      explosions: this.explosions,
      clonedExplosions: this.clonedExplosions,
      clonedLaunchers: this.clonedLaunchers,
      play: this.play,
      getRandom: this.getRandom,
    };

    this.resolution = new Vector2(app.viewport.width, app.viewport.height);
  }

  #createMesh() {
    const geometry = new PlaneGeometry(1, 1, 1, 1);
    const material = new FireworkMaterial({
      uniforms: {
        uProgress: { value: 0 },
        uTime: { value: 0 },
      },
      transparent: true,
    });

    const mesh = new Mesh(geometry, material);
    mesh.scale.set(0.02, 0.02, 0.02);

    return mesh;
  }

  #createExplosion(spritesheet, id) {
    const geometry = new PlaneGeometry(2, 2, 1, 1);
    const material = spritesheet.material;

    const mesh = new Mesh(geometry, material);
    mesh.spritesheet = spritesheet;
    mesh.textureID = id;

    return mesh;
  }

  play(launcher) {
    const randomY = this.getRandom(4, 1);
    const randomIndex = Math.floor(
      Math.random() * this.clonedExplosions.length
    );

    const explosion = this.clonedExplosions.splice(randomIndex, 1)[0];

    if (!explosion) return;
    if (!launcher) return;
    explosion.material.uniforms.uColor.value = new Color(
      ...this.getRandomColor()
    );
    // console.log(explosion.material.uniforms);
    //Anim the launcher
    gsap.to(launcher.position, {
      y: `${randomY}`,
      duration: 1,
      onComplete: () => {
        //When launcher finished play explosion
        explosion.position.copy(launcher.position);
        explosion.lookAt(app.webgl.camera.position);
        explosion.spritesheet.playing = true;
        launcher.position.y = 0;
        this.clonedLaunchers.push(launcher);
      },
    });
  }

  startFirework() {
    let randomTiming = this.getRandom(400, 200);

    setInterval(() => {
      const randomIndex = Math.floor(
        Math.random() * this.clonedLaunchers.length
      );

      const launcher = this.clonedLaunchers.splice(randomIndex, 1)[0];

      this.play(launcher);
    }, randomTiming);
  }

  getRandom(value, interval) {
    const max = value + interval;
    const min = value - interval;

    return Math.random() * (max - min) + min;
  }

  getRandomColor() {
    const colors = [
      [1.0, 0.0, 0.0], // Red
      [0.0, 1.0, 0.0], // Green
      [0.0, 0.0, 1.0], // Blue
      [1.0, 1.0, 0.0], // Yellow
      [1.0, 0.0, 1.0], // Magenta
      [0.0, 1.0, 1.0], // Cyan
      [1.0, 0.5, 0.0], // Orange
      [0.5, 0.0, 0.5], // Purple
      [0.0, 0.5, 0.5], // Teal
      [0.5, 0.5, 0.5], // Gray
    ];

    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
  }

  onFireworksAnimStop(e) {
    const explosion = this.explosions.filter((exp) => exp.textureID == e)[0];
    this.clonedExplosions.push(explosion);
  }

  resize() {
    this.resolution.set(
      app.viewport.width * Math.min(window.devicePixelRatio, 2),
      app.viewport.height * Math.min(window.devicePixelRatio, 2)
    );
  }
}
