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

export default class Fireworks {
  constructor(positions) {
    state.register(this);
    const explosionCount = 6;
    this.launchers = [];
    this.explosions = [];
    this.tempExplosions = [];

    for (let i = 1; i <= explosionCount; i++) {
      //Create explosion mesh
      const explosion = this.#createExplosion(
        new SpritesheetPlayer("explosion" + i),
        "explosion" + i
      );

      this.explosions.push(explosion);
    }

    // this.tempExplosions = this.explosions.slice();

    for (let i = 0; i < positions.length; i++) {
      //Create launch mesh
      const mesh = this.#createMesh();
      mesh.position.copy(positions[i]);
      mesh.rotation.x = -Math.PI / 2;
      mesh.lookAt(app.webgl.camera.position);

      this.launchers.push(mesh);
    }

    return {
      launchers: this.launchers,
      explosions: this.explosions,
      play: this.play,
      getRandom: this.getRandom,
    };

    this.resolution = new Vector2(app.viewport.width, app.viewport.height);
  }

  #createMesh() {
    const geometry = new PlaneGeometry(1, 1, 1, 1);
    const material = new FireworkMaterial({
      uniforms: {},
      transparent: true,
    });

    const mesh = new Mesh(geometry, material);
    mesh.scale.set(0.1, 0.1, 0.1);

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
    const randomY = this.getRandom(4);
    const randomIndex = Math.floor(Math.random() * this.explosions.length);

    // console.log(this.tempExplosions);

    const explosion = this.explosions[randomIndex];

    // console.log(explosion);

    //Anim the launcher
    gsap.to(launcher.position, {
      y: `${randomY}`,
      duration: 1,
      onComplete: () => {
        //When launcher finished play explosion
        explosion.position.copy(launcher.position);
        explosion.lookAt(app.webgl.camera.position);
        explosion.spritesheet.playing = true;
      },
    });
  }

  getRandom(value) {
    const max = value + 1;
    const min = value - 1;

    return Math.random() * (max - min) + min;
  }

  onFireworksAnimStop(e) {
    // console.log(e);
  }

  resize() {
    this.resolution.set(
      app.viewport.width * Math.min(window.devicePixelRatio, 2),
      app.viewport.height * Math.min(window.devicePixelRatio, 2)
    );
  }
}
