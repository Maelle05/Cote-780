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
        x: 0.67,
        y: 0,
        z: 2.19,
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
    this.isAnimating = false;

    this.milo = new Milo();
    this.player = this.milo.model;
    this.player.position.set(-0.88, 0.15, 2.81);
    // this.player.rotation.y = Math.PI - 45;
    const walkDuration = 3;
    this.player.goTo(this.center, walkDuration);
    this.add(this.player);

    //End of the walk
    setTimeout(() => {
      this.#start();
    }, walkDuration * 1000);

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

    this.currentRock = this.rocks[0];
    this.currentRock.material.uniforms.uProgress.value = 1;

    this.spirit = new Spirit();
    this.spirit.hide();

    this.add(this.spirit);

    this.target = new TargetParticles(
      500,
      new Vector3(
        this.rocks[0].position.x,
        this.rocks[0].position.y,
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

    this.radius = this.center.distanceTo(this.rocks[0].position);

    this.anim = new CamAnim(4, this.bridge, [0, 0.25, 0.5, 0.75, 1, 1]);
    // this.anim.onChangeSceneStep(2);

    if (!this.anim) {
      const controls = new OrbitControls(
        app.webgl.camera,
        app.webgl.renderer.domElement
      );
    }

    if (app.webgl.currentScene === 4) this.init();
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

    if (this.anim && this.anim.currentKeyfame != 2) return;
    if (
      this.spirit &&
      this.spirit.position.distanceTo(this.currentRock.position) < 0.3
    ) {
      //TODO : Change Color
    } else if (this.spirit) {
      //TODO : Change Color
    }

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
    if (app.webgl.currentScene != 4 && this.anim.currentKeyfame != 2) return;
    if (this.isAnimating === true) return;

    this.currentRock = this.rocks[this.rockIndex];
    this.nextRock = this.rocks[this.rockIndex + 1];

    if (!this.currentRock) return;
    if (this.spirit.position.distanceTo(this.currentRock.position) > 0.3)
      return;

    const targetAnimDuration = 3;
    const jumpDelay = targetAnimDuration - 0.5;
    const tl = gsap.timeline();

    //Particle animation
    this.spirit.hide();
    this.target.next(targetAnimDuration);

    const dummy = { progress: 0 };

    //Milo Jump
    tl.to(
      dummy,
      {
        progress: 1,
        duration: 1,
        delay: jumpDelay,
        onUpdate: () => {
          const maxYOffset = 0.15;

          const peak = 0.4;
          const scale = 4 / (1 - peak);

          const yOffset =
            maxYOffset *
            Math.max(
              0,
              -scale * (dummy.progress - peak) * (dummy.progress - peak) +
                scale * peak * peak
            );

          this.player.position.set(
            this.center.x,
            this.center.y + yOffset + 0.03,
            this.center.z
          );
        },
      },
      0
    );

    tl.to(
      this.center,
      {
        x: this.currentRock.position.x,
        y: this.currentRock.position.y,
        z: this.currentRock.position.z,
        duration: 1,
        delay: jumpDelay,
        ease: "power2.out",
        onComplete: () => {
          this.player.anims.idle();

          if (this.rockIndex + 1 == this.rocks.length) {
            this.state = "completed";
            //TODO : PLAY NEXT STEP
            this.#endInteraction();
          } else {
            this.isAnimating = false;

            this.radius = this.currentRock.position.distanceTo(
              this.nextRock.position
            );
            this.rockIndex++;
            this.spirit.show();
            this.target.position.set(
              this.nextRock.position.x,
              this.nextRock.position.y,
              this.nextRock.position.z
            );

            if (!this.rocks[this.rockIndex + 1]) return;

            const nextRockPos = new Vector3(
              this.rocks[this.rockIndex + 1].position.x,
              this.rocks[this.rockIndex + 1].position.y,
              this.rocks[this.rockIndex + 1].position.z
            );

            this.target.calculatePos(this.nextRock.position, nextRockPos);
          }
        },
      },
      0
    );

    tl.call(
      () => {
        this.player.anims.jump();
      },
      [],
      jumpDelay - 0.7
    );

    this.isAnimating = true;

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

    if (this.rockIndex === 0) app.audio.layers.playVolumes([0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0]);
    else if (this.rockIndex === 2) app.audio.layers.playVolumes([0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0]);
  }

  #off() {}

  #start() {
    // console.log("start");
    //Create all animations of apparitions
    this.state = "step_1";

    //launch spirit
    this.spirit.show();
  }

  #endInteraction() {
    console.log("TODO : END INTERACTION");
    //Milo gain the cairn
    //Milo rotation look at Durance
    //Durance Apparition
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
