import {
  AmbientLight,
  DirectionalLight,
  DoubleSide,
  Scene,
  Vector3,
  Vector4,
} from "three";
import { state } from "../../utils/State";
import { EVENTS } from "../../utils/constants/events";
import gsap from "gsap";
import { Pane } from "tweakpane";
import { DEV_MODE } from "../../utils/constants/config";
import Spirit from "../objects/Spirit";
import TargetParticles from "../objects/TargetParticles";
import { CamAnim } from "../utils/CamAnim";
import { app } from "@/App";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import Foam from "../objects/Foam";
import { RockMaterial } from "../materials/Rock/material";
import Milo from "../objects/Milo";
import { WaterMaterial } from "../materials/Water/material";
import { MUSIC_IDS } from "@/utils/core/audio/AudioManager";
import Durance from "../objects/Durance";
import Vegetation from "../objects/Vegetation";
import Clouds from "../objects/Clouds";
import { Raycaster } from "three";

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

    this.raycaster = new Raycaster();

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

    this.rockIndex = 0;
    this.minSpeed = 0.01;
    this.elapsedTime = 0;
    this.interval = 1000;
    this.isAnimating = false;
    this.goNext = false;
    this.nbJumps = 0;

    this.milo = new Milo();
    this.player = this.milo.model;
    this.player.position.set(-0.88, 0.15, 2.81);
    // this.player.rotation.y = Math.PI - 45;
    this.add(this.player);

    this.durance = new Durance(app.assetsManager.get("duranceFace"));
    this.durance.rotation.y = (-30 * Math.PI) / 180;
    this.durance.scale.set(1.3, 1.3, 1.3);
    this.durance.hide();
    this.durance.position.set(0, 0, 0);
    this.add(this.durance);

    this.spirit.hide();
    const walkDuration = 7;

    app.webgl.shake.startShake();
    app.audio.playMusic(MUSIC_IDS.AMBIENT_BRIDGE);
  }

  onAskRemoveTransition() {
    if (app.webgl.currentScene != 4) return;
    this.player.goTo(this.center, 6);
    setTimeout(() => {
      this.#start();
      state.emit(EVENTS.GO_NEXT);
    }, 4000);
  }

  onAttach() {
    this.center = new Vector3(0.67, 0.01, 2.19);
    this.rocks = [];

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
            uTexture: { value: child.material.map },
          },
          side: DoubleSide,
        });

        this.rocks.push(child);
      }

      //Remove 2cnd Milo because here for no reasons
      if (child.isMesh && child.name.includes("Milo")) {
        child.visible = false;
      }
    });

    this.currentRock = this.rocks[0];
    this.currentRock.material.uniforms.uProgress.value = 1;

    this.spirit = new Spirit();
    // this.spirit.hide();
    this.spirit.position.copy(this.rocks[this.rocks.length - 1].position);
    this.spirit.position.y += 0.2;
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

    this.vegetation = new Vegetation("bridge", 0.8);
    this.add(this.vegetation);

    this.clouds = new Clouds(
      this.bridge.getObjectByName("CloudStart").position,
      this.bridge.getObjectByName("CloudEnd").position
    );
    this.add(this.clouds);

    this.bridge.name = "bridge";
    app.webgl.shake.initShake(this.bridge);
  }

  onTick(e) {
    if (app.webgl.currentScene != 4) return;
    if (this.target)
      this.target.material.uniforms.uTime.value = app.ticker.elapsed;
    if (this.water)
      this.water.material.uniforms.uTime.value = app.ticker.elapsed;
    if (app.sceneshandler.currentStepCam == 4 && !this.durance.isActive) {
      this.durance.isActive = true;
      this.durance.show();
      app.audio.ui.play("wave_appear");
      this.player.lookAt(this.durance.position);
    }
    if (app.sceneshandler.currentStepCam == 5 && this.durance.isActive) {
      this.durance.isActive = false;
      this.durance.hide();
    }

    if (
      this.anim &&
      this.anim.currentKeyfame == 0 &&
      this.anim.currentKeyfame == 1 &&
      this.anim.currentKeyfame == 4 &&
      this.anim.currentKeyfame == 5
    )
      return;

    if (!this.spirit) return;

    // this.angle = app.ticker.elapsed * 0.0015;

    // const animRadiusX = 0.7;
    // const animRadiusZ = 0.2;
    // const rotationAngle = Math.PI / 4;
    // const center = this.rocks[this.rockIndex].position;

    // const x = animRadiusX * Math.sin(this.angle);
    // const z = animRadiusZ * Math.sin(2 * this.angle);

    // // Apply rotation to the X and Z positions
    // const rotatedX = x * Math.cos(rotationAngle) - z * Math.sin(rotationAngle);
    // const rotatedZ = x * Math.sin(rotationAngle) + z * Math.cos(rotationAngle);

    // // Translate the rotated position back to the center
    // const finalX = center.x + rotatedX;
    // const finalZ = center.z + rotatedZ;

    // this.spirit.position.set(finalX, center.y + 0.2, finalZ);

    // if (
    //   this.spirit.position.distanceTo(this.rocks[this.rockIndex].position) < 0.3
    // ) {
    //   this.spirit.targetSpiritColor = new Vector4(0.941, 0.608, 0.345);
    // } else {
    //   this.spirit.targetSpiritColor = new Vector4(1, 1, 1, 1);
    // }
  }

  onPointerMove(e) {
    if (app.webgl.currentScene != 4) return;
    const mesh = this.rocks[this.rockIndex];

    this.raycaster.setFromCamera(e.webgl, app.webgl.camera);
    const intersects = this.raycaster.intersectObject(mesh);

    if (intersects.length != 0) {
      this.goNext = true;
      document.body.style.cursor = "pointer";
    } else {
      this.goNext = false;
      document.body.style.cursor = "default";
    }
  }

  onPointerDown() {
    if (app.webgl.currentScene != 4) return;
    if (
      this.anim.currentKeyfame == 0 ||
      this.anim.currentKeyfame == 1 ||
      this.anim.currentKeyfame == 4 ||
      this.anim.currentKeyfame == 5
    )
      return;
    if (this.isAnimating === true) return;

    if (!this.isTutoPass && this.anim.currentKeyfame == 2) {
      this.isTutoPass = true;
      state.emit(EVENTS.TUTO_PASS, 4);
    }

    this.currentRock = this.rocks[this.rockIndex];
    this.nextRock = this.rocks[this.rockIndex + 1];

    if (!this.currentRock || this.goNext == false) return;

    this.nbJumps++;
    if (this.nbJumps == 1) state.emit(EVENTS.GO_NEXT);

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
        duration: 1.2,
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
    tl.call(
      () => {
        app.audio.ui.play("jump_rock");
      },
      [],
      ">-0.7"
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
      duration: 1.5,
    });

    if (this.rockIndex === 0)
      app.audio.layers.playVolumes([0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0]);
    else if (this.rockIndex === 2)
      app.audio.layers.playVolumes([0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0]);
  }

  #off() {}

  #start() {
    //launch spirit
    this.spirit.show();
  }

  #endInteraction() {
    // console.log("TODO : END INTERACTION");
    //Milo gain the cairn
    //Milo rotation look at Durance
    //Durance Apparition

    state.emit(EVENTS.GO_NEXT);
  }

  clear() {
    if (DEV_MODE) {
      this.pane.dispose();
    }

    app.audio.fadeOutAmbient();
    app.webgl.shake.stopShake();
  }
}

export { Bridge };
