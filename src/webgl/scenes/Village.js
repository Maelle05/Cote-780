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
import { MUSIC_IDS } from "@/utils/core/audio/AudioManager";
import { EVENTS } from "@/utils/constants/events";

class Village extends Scene {
  constructor() {
    super();
    state.register(this);

    this.light = new AmbientLight({ color: 0xffffff });
    this.add(this.light);

    this.directionLight = new DirectionalLight(0xffffff);
    this.directionLight.intensity = 2;
    this.directionLight.position.set(7, 10, 15);
    this.add(this.directionLight);
  }

  init() {
    if (DEV_MODE) {
      this.pane = new Pane({ title: "Parameters Village", expanded: true });
    }

    app.audio.playMusic(MUSIC_IDS.AMBIENT_UNDERWATER);
    app.webgl.shake.startShake();
  }

  onAttach() {
    this.scene = app.assetsManager.get("village");
    app.webgl.shake.initShake(this.scene);

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

    this.fog = new FogExp2("#0F4185", 0.08);

    this.addGodRays();

    this.spirit = new Spirit();
    this.spirit.position.set(-10, 0.7, 7);

    this.anim = new CamAnim(6, this.scene, [0, 0, 0.2, 0.33, 0.66, 1, 1, 1]);
    this.targetProgressAnim = 1;

    this.add(this.scene, this.spirit, this.ambient);

    if (app.webgl.currentScene === 6) this.init();
  }

  onAskRemoveTransition(){
    if (app.sceneshandler.currentScene != 6) return;

    setTimeout(()=> {
      state.emit(EVENTS.GO_NEXT)
    }, 4000)
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

    if (
      this.animationMixer &&
      this.bookAnim &&
      app.sceneshandler.currentStepCam == 3 &&
      app.sceneshandler.currentStepText == 3
    ) {
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
    app.webgl.shake.stopShake();
  }
}

export { Village };
