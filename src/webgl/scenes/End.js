import { AmbientLight, DoubleSide, MathUtils, Scene, Vector3 } from "three";
import { state } from "../../utils/State";
import TestPlane from "../objects/TestPlane";
import { Pane } from "tweakpane";
import { PlaneGeometry } from "three";
import { MeshBasicMaterial } from "three";
import { Mesh } from "three";
import Fireworks from "../objects/Fireworks";
import { DEV_MODE } from "../../utils/constants/config";
import { app } from "@/App";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { SpritesheetPlayer } from "../utils/SpritesheetPlayer";
import { CamAnim } from "../utils/CamAnim";
import { DirectionalLight } from "three";
import { WaterMaterial } from "../materials/Water/material";
import { MUSIC_IDS } from "@/utils/core/audio/AudioManager";
import { AnimationMixer } from "three";
import { EVENTS } from "@/utils/constants/events";

class End extends Scene {
  constructor() {
    super();
    state.register(this);

    this.allPos = [
      { x: -10, y: -0.01, z: 6 },
      { x: -15, y: -0.01, z: 3 },
      { x: -9, y: -0.01, z: -3 },
      { x: -8, y: -0.01, z: 3 },
      { x: -12, y: -0.01, z: 0 },
      { x: -11, y: -0.01, z: 3 },
    ];

    this.PARAMS = {
      planePos: {
        x: 0,
        y: 1,
        z: 0,
      },
    };

    this.light = new AmbientLight({ color: 0xffffff });
    this.add(this.light);

    this.directionLight = new DirectionalLight(0xffffff);
    this.directionLight.intensity = 2;
    this.directionLight.position.set(7, 10, 15);
    this.add(this.directionLight);
  }

  init() {
    if (DEV_MODE) {
      this.pane = new Pane({ title: "Parameters End", expanded: true });
      this.pane
        .addBinding(this.PARAMS, "planePos", {
          min: -10,
          max: 10,
          step: 0.1,
        })
        .on("change", (ev) => {
          this.planePos.position.set(ev.value.x, ev.value.y, ev.value.z);
        });
    }

    app.webgl.shake.startShake();
    app.audio.playMusic(MUSIC_IDS.AMBIENT_LAKE);
  }

  onAttach() {
    this.fireworks = new Fireworks(this.allPos);
    this.fireworks.launchers.forEach((launcher) => this.add(launcher));
    this.fireworks.explosions.forEach((explosions) => this.add(explosions));

    this.planePos = new Mesh(
      new PlaneGeometry(1, 1, 1, 1),
      new MeshBasicMaterial({ color: 0xff0000, side: DoubleSide })
    );
    this.planePos.rotation.x = Math.PI / 2;
    this.planePos.visible = false;
    this.add(this.planePos);

    this.end = app.assetsManager.get("end");
    app.webgl.shake.initShake(this.end);
    this.end.traverse((el) => {
      if (el.name == "WaterSurface") {
        this.water = el;
        el.material = new WaterMaterial({
          uniforms: {
            uTexture: { value: el.material.map },
            uTime: { value: 0 },
          },
          transparent: true,
        });
      }
    });
    this.initAnimPorte();

    this.ambient = new AmbientLight({ color: 0xffffff, intensity: 0.1 });

    this.add(this.end, this.ambient);

    this.anim = new CamAnim(7, this.end, [0, 0, 0.33, 0.66, 1]);
    // this.anim.onChangeSceneStep(3);

    if (!this.anim) {
      const controls = new OrbitControls(
        app.webgl.camera,
        app.webgl.renderer.domElement
      );
    }

    if (app.webgl.currentScene === 7) this.init();
  }

  initAnimPorte() {
    this.allAnimCairn = this.end.animations.filter((el) =>
      el.name.includes("Cube.")
    );
    this.allMixerCairn = [];
    this.allActionCairn = [];
    this.currentProgressCairn = 0;

    this.allAnimCairn.forEach((cairnAnim) => {
      const mixer = new AnimationMixer(this.end);
      const action = mixer.clipAction(cairnAnim);
      action.play();
      action.paused = true;

      this.allMixerCairn.push(mixer);
      this.allActionCairn.push(action);
    });
  }

  onTick() {
    if (app.sceneshandler.currentScene != 7) return;

    if (this.water)
      this.water.material.uniforms.uTime.value = app.ticker.elapsed;

    if (
      this.allAnimCairn.length == this.allActionCairn.length &&
      app.sceneshandler.currentStepCam == 1
    ) {
      this.currentProgressCairn = MathUtils.lerp(
        this.currentProgressCairn,
        1,
        0.02
      );

      this.allActionCairn.forEach((action, i) => {
        action.paused = false;
        this.allMixerCairn[i].setTime(
          this.allAnimCairn[i].duration * this.currentProgressCairn
        );
        action.paused = true;
        this.allMixerCairn[i].update(app.ticker.delta);
      });

      if (this.currentProgressCairn > 0.98) {
        // state.emit(EVENTS.GO_NEXT)
      }
    }
  }

  onUpdateDialogue(step) {
    if (!step || !step.audio) return;

    if (step.audio === "esprit_8")
      app.audio.layers.playVolumes([0, 0, 0, 0.7, 0.7, 0, 0, 0.7, 0, 0.7, 0.7]);
    else if (step.audio === "esprit_9")
      app.audio.layers.playVolumes([
        0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7,
      ]);
    else if (step.audio === "esprit_10")
      app.audio.layers.playVolumes([0, 0, 0, 0.7, 0.7, 0, 0, 0.7, 0, 0.7, 1]);
    else if (step.audio === "esprit_11")
      app.audio.layers.playVolumes([0, 0, 0, 0.7, 0.7, 0, 0, 0, 0, 0, 0]);
    else if (step.audio === "esprit_12")
      app.audio.layers.playVolumes([0, 0, 0, 0, 0.7, 0, 0, 0, 0, 0, 0]);
  }

  clear() {
    if (DEV_MODE) {
      this.pane.dispose();
    }

    app.audio.fadeOutAmbient();
    app.webgl.shake.stopShake();
  }

  onResize() {}
}

export { End };
