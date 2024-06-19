import { AmbientLight, FogExp2, MathUtils, Scene, Vector3 } from "three";
import { state } from "../../utils/State";
import { Pane } from "tweakpane";
import { DEV_MODE } from "../../utils/constants/config";
import { app } from "../../App";
import { CamAnim } from "../utils/CamAnim";
import { MeshMatcapMaterial } from "three";
import GodRays from "../objects/GodRays";
import { Group } from "three";
import Spirit from "../objects/Spirit";
import { DirectionalLight } from "three";
import { AnimationMixer } from "three";
import { AMBIENT_IDS, MUSIC_IDS } from "@/utils/core/audio/AudioManager";
import { EVENTS } from "@/utils/constants/events";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { PointLight } from "three";
import { AlgueMaterial } from "../materials/Algue/material";

class Village extends Scene {
  algues = [];

  constructor() {
    super();
    state.register(this);

    this.light = new AmbientLight({ color: 0xffffff });
    this.add(this.light);

    this.directionLight = new DirectionalLight(0xffffff);
    this.directionLight.intensity = 2;
    this.directionLight.position.set(7, 10, 15);
    this.add(this.directionLight);

    this.pointLight = new PointLight(0xffffff);
    this.pointLight.position.set(9.23, 0.6, -1.9);
    this.pointLight.intensity = 0.4;
    this.pointLight.distance = 1;
    this.pointLight.castShadow = false;
    this.add(this.pointLight);
  }

  init() {
    if (DEV_MODE) {
      this.pane = new Pane({ title: "Parameters Village", expanded: true });
    }

    app.audio.playAmbient(AMBIENT_IDS.AMBIENT_UNDERWATER);
    app.audio.playMusic(MUSIC_IDS.VILLAGE_LOOP);
    app.webgl.shake.startShake();
  }

  onAttach() {
    this.scene = app.assetsManager.get("village");

    this.scene.traverse((child) => {
      if (child.name == "Empty001") {
        child.receiveShadow = false;
      }
      if (child.name.includes("Algue")) {
        this.algues.push(child);
        child.material = new AlgueMaterial({
          uniforms: {
            uTexture: { value: child.material.map },
            uTime: { value: 0 },
          },
          transparent: true,
        })
      }
    });

    this.bookAnim = this.scene.animations.find(
      (el) => el.name == "Armature.001Action"
    );

    this.animationMixer = new AnimationMixer(this.scene);
    this.animationAction = this.animationMixer.clipAction(this.bookAnim);
    this.animationAction.play();
    this.animationAction.paused = true;
    this.animationMixer.setTime(0);
    this.animationAction.paused = true;
    this.animationMixer.update(app.ticker.delta);
    this.targetProgressAnim = 0;
    this.currentProgressAnim = 0;

    this.ambient = new AmbientLight({ color: 0xffffff, intensity: 0.1 });

    this.scene.name = "village";
    // app.webgl.shake.initShake(this.scene);

    this.fog = new FogExp2("#0F4185", 0.08);

    this.addGodRays();

    this.spirit = new Spirit();
    this.spirit.position.set(-10, 0.7, 7);

    this.anim = new CamAnim(6, this.scene, [0, 0, 0.15, 0.30, 0.55, 0.82, 0.84, 0.86, 0.9, 0.92, 0.95, 1, 1]);

    if (!this.anim) {
      const controls = new OrbitControls(
        app.webgl.camera,
        app.webgl.renderer.domElement
      );
    }

    this.add(this.scene, this.spirit, this.ambient);

    if (app.webgl.currentScene === 6) this.init();
  }

  onAskRemoveTransition() {
    if (app.sceneshandler.currentScene != 6) return;

    setTimeout(() => {
      state.emit(EVENTS.GO_NEXT);
    }, 4000);
  }

  onTick() {
    if (app.sceneshandler.currentScene != 6) return;
    if (this.spirit) {
      switch (app.sceneshandler.currentStepCam) {
        case 0:
        case 1:
          this.spiritTargetPos = new Vector3(-10, 0.7, 7);
          break;
        case 2:
          this.spiritTargetPos = new Vector3(-8, 0.7, 5);
          break;

        case 3:
          this.spiritTargetPos = new Vector3(-2, 0.7, 0.5);
          break;

        case 4:
          this.spiritTargetPos = new Vector3(8, 0.7, -3);
          break;

        case 5:
          this.spiritTargetPos = new Vector3(8, 0.7, -3.5);
          break;

        default:
          this.spiritTargetPos = new Vector3(-9.5, 0.7, 6);
          break;
      }
      const newPos = this.spirit.position.lerp(this.spiritTargetPos, 0.03);
      this.spirit.position.set(newPos.x, newPos.y, newPos.z);
    }

    if (this.animationMixer && this.bookAnim) {
      if (
        app.sceneshandler.currentStepCam == 8 &&
        app.sceneshandler.currentStepText == 0
      ) {
        this.targetProgressAnim = 0;
        this.currentProgressAnim = MathUtils.lerp(
          this.currentProgressAnim,
          this.targetProgressAnim,
          0.01
        );

        this.animationAction.paused = false;
        this.animationMixer.setTime(
          this.bookAnim.duration * this.currentProgressAnim
        );
        this.animationAction.paused = true;
        this.animationMixer.update(app.ticker.delta);
      } else if (app.sceneshandler.currentStepCam < 3) {
        this.targetProgressAnim = 1;
        this.currentProgressAnim = MathUtils.lerp(
          this.currentProgressAnim,
          this.targetProgressAnim,
          0.01
        );
        this.animationAction.paused = false;
        this.animationMixer.setTime(
          this.bookAnim.duration * this.currentProgressAnim
        );
        this.animationAction.paused = true;
        this.animationMixer.update(app.ticker.delta);
      }
    }

    this.algues.forEach((algue) => algue.material.uniforms.uTime.value = app.ticker.elapsed);
  }

  addGodRays() {
    this.godRays = new Group();
    this.godRay1 = new GodRays();
    this.godRay1.position.set(-9, 1.7, 6);
    this.godRay2 = new GodRays();
    this.godRay2.position.set(-2, 1.8, 0.5);
    this.godRay3 = new GodRays();
    this.godRay3.position.set(8.5, 1.8, -2.8);
    this.godRay4 = new GodRays();
    this.godRay4.position.set(14, 1.8, -6.5);
    this.godRay4.material.uniforms.g_alpha.value = 0.5;
    this.godRays.add(this.godRay1, this.godRay2, this.godRay3, this.godRay4);

    this.add(this.godRays);
  }

  clear() {
    if (DEV_MODE) {
      this.pane.dispose();
    }

    app.audio.fadeOutAmbient();
    app.audio.fadeOutMusic();
    app.webgl.shake.stopShake();
  }
}

export { Village };
