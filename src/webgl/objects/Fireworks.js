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

export default class Fireworks {
  constructor(positions) {
    const explosionCount = 6;
    this.launchers = [];
    this.explosions = [];

    for (let i = 1; i <= explosionCount; i++) {
      //Create explosion mesh
      const explosion = this.#createExplosion(
        new SpritesheetPlayer("explosion" + i)
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

  #createExplosion(spritesheet) {
    const geometry = new PlaneGeometry(1, 1, 1, 1);
    const material = spritesheet.material;

    const mesh = new Mesh(geometry, material);
    mesh.spritesheet = spritesheet;

    return mesh;
  }

  play(launcher) {
    const randomY = this.getRandom(4);
    const randomExplo = Math.round(
      Math.random() * (this.explosions.length - 1)
    );

    const explosion = this.explosions[randomExplo];

    //Anim the launcher
    gsap.to(launcher.position, {
      y: `+= ${randomY}`,
      duration: 1,
      onComplete: () => {
        explosion.position.copy(launcher.position);
        explosion.lookAt(app.webgl.camera.position);
        explosion.spritesheet.playing = true;
      },
    });

    //When launcher finished play explosion
  }

  getRandom(value) {
    const max = value + 1;
    const min = value - 1;

    return Math.random() * (max - min) + min;
  }

  resize() {
    this.resolution.set(
      app.viewport.width * Math.min(window.devicePixelRatio, 2),
      app.viewport.height * Math.min(window.devicePixelRatio, 2)
    );
  }
}
