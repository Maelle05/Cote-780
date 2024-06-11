import {
  AmbientLight,
  CircleGeometry,
  DirectionalLight,
  DoubleSide,
  EdgesGeometry,
  LineBasicMaterial,
  LineSegments,
  Mesh,
  MeshBasicMaterial,
  Scene,
  SphereGeometry,
  HemisphereLight,
  Vector3,
  Color,
  RepeatWrapping,
} from "three";
import { state } from "../../utils/State";
import { EVENTS } from "../../utils/constants/events";
import gsap from "gsap";
import { Pane } from "tweakpane";
import { DirectionalLightHelper } from "three";
import { DEV_MODE } from "../../utils/constants/config";
import Spirit from "../objects/Spirit";
import TargetParticles from "../objects/TargetParticles";
import Cairn from "../objects/Cairn";
import { CamAnim } from "../utils/CamAnim";
import { app } from "@/App";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import Foam from "../objects/Foam";
import { RockMaterial } from "../materials/Rock/material";
import Milo from "../objects/Milo";
import { WaterMaterial } from "../materials/Water/material";
import { MUSIC_IDS } from "@/utils/core/audio/AudioManager";
import { ShakiraMaterial } from "../materials/Shakira/material";
import { Vector2 } from "three";

class Bridge extends Scene {
  constructor() {
    super();
    state.register(this);

    this.PARAMS = {
      posPerso: {
        x: 0,
        y: 0,
        z: 0,
      },
      targetProgress: 0,
      targetNoise: 2,
    };

    this.light = new AmbientLight({ color: 0xffffff });
    this.add(this.light);

    this.directionLight = new DirectionalLight(0xffffff);
    this.directionLight.intensity = 2;
    this.directionLight.position.set(7, 10, 15);
    this.add(this.directionLight);

    // this.position.set(2, 0, -1.5);

    //States : off / start / step_1 / step_2 / step_3 / completed
    this.state = "off";
  }

  init() {
    if (DEV_MODE) {
      this.pane = new Pane({ title: "Parameters Bridge", expanded: true });
      this.pane
        .addBinding(this.PARAMS, "posPerso", {
          min: -10,
          max: 10,
          step: 0.01,
        })
        .on("change", (ev) => {
          this.player.position.set(ev.value.x, ev.value.y, ev.value.z);
        });
      this.pane
        .addBinding(this.PARAMS, "targetProgress", {
          min: 0,
          max: 1,
          step: 0.001,
        })
        .on("change", (ev) => {
          this.target.material.uniforms.uProgress.value = ev.value;
        });

      this.pane
        .addBinding(this.PARAMS, "targetNoise", {
          min: 0,
          max: 10,
          step: 0.001,
        })
        .on("change", (ev) => {
          this.target.material.uniforms.uNoiseOffset.value = ev.value;
        });
    }

    this.angle = 0;
    this.direction = 1;
    this.radius = 0.68;
    this.radiusOffset = 0;
    this.rockIndex = 0;
    this.minSpeed = 0.01;
    this.elapsedTime = 0;
    this.interval = 1000;

    this.milo = new Milo();
    this.player = this.milo.model;
    this.player.position.set(this.center.x, this.center.y, this.center.z);
    // this.player.scale.set(0.1, 0.1, 0.1);
    this.player.rotation.y = Math.PI - 45;
    this.player.anims.idle();

    this.add(this.player);

    app.audio.playMusic(MUSIC_IDS.AMBIENT_FOREST);
  }

  onAttach() {
    this.center = new Vector3(0.67, 0.01, 2.19);
    this.rocks = [];
    this.shakePlanes = [];

    this.bridge = app.assetsManager.get("bridge");
    this.add(this.bridge);

    this.bridge.traverse((child) => {
      //Remove reflection from material
      // if ((child.isMesh && child.name === "Water") || child.name == "Ground") {
      //   child.material.roughness = 1;
      // }

      if (child.name == "WaterSurface") {
        this.water = child;
        child.material = new WaterMaterial({
          uniforms: {
            uTexture: { value: child.material.map },
            uTime: { value: 0 },
          },
          transparent: true,
        });
      }

      if (child.isMesh && child.name.includes("Rock")) {
        const plane = new Foam();
        plane.position.copy(child.position);
        plane.rotation.x = Math.PI / 2;
        plane.position.y -= 0.02;
        plane.visible = false;
        this.add(plane);

        child.material = new RockMaterial({
          uniforms: {
            uProgress: { value: 0 },
          },
          side: DoubleSide,
        });

        this.rocks.push(child);
      }

      //Remove 2cnd Milo because here for no reasons
      if (child.isMesh && child.name.includes("Milo")) {
        child.visible = false;
      }

      if (child.isMesh && child.name.includes("Plane")) {
        child.material = new ShakiraMaterial({
          uniforms: {
            uTexture: { value: child.material.map },
            uTime: { value: 0 },
            uOffset: { value: new Vector2() },
          },
        });

        this.shakePlanes.push(child);
      }
    });

    this.rocks[0].material.uniforms.uProgress.value = 1;

    this.spirit = new Spirit();
    this.spirit.hide();

    this.add(this.spirit);

    this.target = new TargetParticles(
      500,
      new Vector3(
        this.rocks[0].position.x,
        this.rocks[0].position.y + 0.2,
        this.rocks[0].position.z
      ),
      0.02,
      new Vector3(
        this.rocks[1].position.x,
        this.rocks[1].position.y + 0.2,
        this.rocks[1].position.z
      )
    );
    this.add(this.target);

    this.cairn = new Cairn();
    this.cairn.position.set(
      this.rocks.at(-1).position.x,
      this.rocks[0].position.y + 0.2,
      this.rocks.at(-1).position.z
    );

    this.add(this.cairn);

    this.radius = this.center.distanceTo(this.rocks[0].position);

    this.radius = this.center.distanceTo(this.rocks[0].position);

    this.anim = new CamAnim(4, this.bridge, [0, 0.25, 0.50, 0.75, 1, 1]);
    // this.anim.onChangeSceneStep(2);

    if (!this.anim) {
      const controls = new OrbitControls(
        app.webgl.camera,
        app.webgl.renderer.domElement
      );
    }

    if (app.webgl.currentScene === 4) this.init();
    setTimeout(() => {
      this.#start();
    }, 1000);
  }

  onTick(e) {
    if (app.webgl.currentScene != 4) return;
    if (this.target)
      this.target.material.uniforms.uTime.value = app.ticker.elapsed;
    if (this.water)
      this.water.material.uniforms.uTime.value = app.ticker.elapsed;

    // console.log(e.et % 1000);
    this.elapsedTime += e.dt;

    //Shake UVS
    if (this.shakePlanes && this.elapsedTime > 0.3) {
      this.shakePlanes.forEach((plane) => {
        plane.material.uniforms.uOffset.value = this.#getRandomOffset(
          0.008,
          0.002
        );
      });

      this.elapsedTime = 0;
    }
    // if (this.anim.currentKeyfame != 2) return;
    if (this.state == "off") return;
    let normalizedAngle = this.angle / (Math.PI / 2);

    // Calculate easing based on the current angle's distance from the center
    let easing = Math.abs(normalizedAngle);

    // Calculate new angle based on easing
    let angleIncrement = (0.05 * easing + this.minSpeed) * this.direction;
    this.angle += angleIncrement;

    if (this.angle >= Math.PI / 2 || this.angle <= -Math.PI / 2) {
      this.direction *= -1;
    }

    this.progressAngle = Math.abs(this.angle / (Math.PI / 2));

    // if (this.progressAngle > 0.7 && this.progressAngle < 0.85)
    //   this.radiusOffset += 0.0051;
    // if (this.progressAngle > 0.85) this.radiusOffset -= 0.0051;

    if (!this.spirit) return;

    this.x =
      this.center.x +
      (this.radius + this.radiusOffset) * Math.cos(this.angle - 0.6);
    this.z =
      this.center.z +
      (this.radius + this.radiusOffset) * Math.sin(this.angle - 0.6);

    this.spirit.position.set(this.x, this.rocks[0].position.y + 0.2, this.z);

    if (this.spirit.position.distanceTo(this.target.position) < 0.15) {
      // this.spirit.material.color = new Color("red");
    } else {
      // this.spirit.material.color = new Color("white");
    }
  }

  onPointerDown() {
    if (app.webgl.currentScene != 4 || this.state == "off") return;

    this.currentRock = this.rocks[this.rockIndex];
    this.nextRock = this.rocks[this.rockIndex + 1];

    if (!this.currentRock) return;
    if (this.spirit.position.distanceTo(this.target.position) > 0.2) return;

    const targetAnimDuration = 3;

    //Particle animation
    this.spirit.hide();
    this.target.next(targetAnimDuration);
    // this.player.anims.jump();

    //Milo Jump
    gsap.to(this.center, {
      x: this.currentRock.position.x,
      y: this.currentRock.position.y,
      z: this.currentRock.position.z,
      duration: 1,
      delay: targetAnimDuration,
      ease: "power1.out",
      onUpdate: () => {
        this.player.position.set(
          this.center.x,
          this.center.y + 0.03,
          this.center.z
        );
      },
      onStart: () => this.player.anims.jump(),
      onComplete: () => {
        if (this.rockIndex + 1 == this.rocks.length) {
          this.state = "completed";
        } else {
          this.radius = this.currentRock.position.distanceTo(
            this.nextRock.position
          );
          this.rockIndex++;
          this.spirit.show();
          this.target.position.set(
            this.nextRock.position.x,
            this.nextRock.position.y + 0.2,
            this.nextRock.position.z
          );

          this.player.anims.idle();

          if (!this.rocks[this.rockIndex + 1]) return;

          const nextRockPos = new Vector3(
            this.rocks[this.rockIndex + 1].position.x,
            this.rocks[this.rockIndex + 1].position.y + 0.2,
            this.rocks[this.rockIndex + 1].position.z
          );

          this.target.calculatePos(this.nextRock.position, nextRockPos);

          // this.target.show(
          //   new Vector3(
          //     this.nextRock.position.x,
          //     this.nextRock.position.y + 0.2,
          //     this.nextRock.position.z
          //   )
          // );
        }
      },
    });

    if (!this.nextRock) {
      state.emit(EVENTS.VIEW_COLLECTION_CAIRNS, 4);
      return;
    }

    //NextRock
    gsap.to(this.rocks[this.rockIndex + 1].material.uniforms.uProgress, {
      value: 1,
      ease: "power1.in",
      duration: 1,
    });
  }

  #off() {}

  #start() {
    // console.log("start");
    //Create all animations of apparitions
    this.state = "step_1";

    //launch spirit
    this.spirit.show();

    //launch Particles
    // this.target.show(
    //   new Vector3(
    //     this.rocks[0].position.x,
    //     this.rocks[0].position.y + 0.2,
    //     this.rocks[0].position.z
    //   )
    // );
  }

  #getRandomOffset(value, interval) {
    const max = value + interval;
    const min = value - interval;

    const randomX = Math.random() * (max - min) + min;
    const randomY = Math.random() * (max - min) + min;

    return new Vector2(randomX, randomY);
  }

  clear() {
    if (DEV_MODE) {
      this.pane.dispose();
    }

    app.audio.fadeOutAmbient();
  }
}

export { Bridge };
