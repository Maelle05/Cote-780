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
import { CustomEase } from "gsap/CustomEase";

export default class Fireworks {
  constructor(positions) {
    gsap.registerPlugin(CustomEase);

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

    return {
      launchers: this.launchers,
      explosions: this.explosions,
      clonedExplosions: this.clonedExplosions,
      clonedLaunchers: this.clonedLaunchers,
      play: this.play,
      getRandom: this.getRandom,
      start: () => { this.startFirework(); },
    };
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
    mesh.scale.set(0.05, 0.2, 0.05);

    return mesh;
  }

  #createExplosion(spritesheet, id) {
    const geometry = new PlaneGeometry(1, 1, 1, 1);
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

    if (!launcher) return;

    const explosion = this.clonedExplosions.splice(randomIndex, 1)[0];

    if (!explosion) return;
    explosion.material.uniforms.uColor.value = new Color(
      ...this.getRandomColor()
    );

    const tl = gsap.timeline();

    // console.log(explosion.material.uniforms);
    //Anim the launcher
    tl.to(launcher.position, {
      y: `${randomY}`,
      duration: 1,
      ease: CustomEase.create(
        "custom",
        "M0,0 C0.126,0.382 0.282,0.674 0.44,0.822 0.632,1.002 0.81,1.048 1,0.971 "
      ),
      onUpdate: () => {
        launcher.material.uniforms.uProgress.value = tl.progress();
      },
      onComplete: () => {
        //When launcher finished play explosion
        explosion.visible = true;
        explosion.position.copy(launcher.position);
        explosion.lookAt(app.webgl.camera.position);
        explosion.spritesheet.playing = true;
        app.audio.ui.play(`fireworks_${Math.floor(Math.random() * 3) + 1}`, 0.5);
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
      [0.671, 0.722, 0.89], // Lightblue
      [0.922, 0.937, 0.988], // White
      [0.267, 0.294, 0.6], // Darkblue
      [0.173, 0.196, 0.463], // Darkblue2
      [0.729, 0.263, 0.263], // Red
      [0.89, 0.565, 0.467], // Orange
      [0.937, 0.8, 0.761], // Beige
    ];

    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
  }

  onFireworksAnimStop(e) {
    const explosion = this.explosions.filter((exp) => exp.textureID == e)[0];
    explosion.visible = false;
    this.clonedExplosions.push(explosion);
  }

  resize() {
    this.resolution.set(
      app.viewport.width * Math.min(window.devicePixelRatio, 2),
      app.viewport.height * Math.min(window.devicePixelRatio, 2)
    );
  }
}
