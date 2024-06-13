import {
  Scene,
  MeshMatcapMaterial,
  AmbientLight,
  DoubleSide,
  Raycaster,
  Color,
} from "three";
import { state } from "../../utils/State";
import { Pane } from "tweakpane";
import { Mesh } from "three";
import { PlaneGeometry } from "three";
import { MeshBasicMaterial } from "three";
import { SphereGeometry } from "three";
import gsap from "gsap";
import { DEV_MODE } from "../../utils/constants/config";
import { EVENTS } from "../../utils/constants/events";
import { CamAnim } from "../utils/CamAnim";
import { app } from "@/App";
import Milo from "../objects/Milo";
import Spirit from "../objects/Spirit";
import { DirectionalLight } from "three";
import { WaterMaterial } from "../materials/Water/material";
import { Vector4 } from "three";
import Durance from "../objects/Durance";
import { MUSIC_IDS } from "@/utils/core/audio/AudioManager";
import { Vector3 } from "three";
import Vegetation from "../objects/Vegetation";


class Dam extends Scene {
  constructor() {
    super();
    state.register(this);

    this.raycaster = new Raycaster();

    this.light = new AmbientLight({ color: 0xffffff });
    this.add(this.light);

    this.directionLight = new DirectionalLight(0xffffff);
    this.directionLight.intensity = 2;
    this.directionLight.position.set(7, 10, 15);
    this.add(this.directionLight);

    this.PARAMS = {
      scenePos: {
        x: -3.2,
        y: -2.4,
        z: -5.2,
      },
      sceneRot: {
        x: 0,
        y: 0,
        z: 0,
      },
      persoPos: {
        x: 3.7,
        y: 0.45,
        z: 7.0,
      },
      spiritPos: {
        x: 0,
        y: 0,
        z: 0,
      },
      rocksPos: {
        x: -1.1,
        y: -1.5,
        z: 2.4,
      },
    };

    this.nbClick = 0;
    this.isAnimIntroPass = false;
    this.isTutoPass = false;
    this.miloHasMove = false;
  }

  onAttach() {
    this.scene = app.assetsManager.get("dam");
    this.rocks = [];
    this.scene.traverse((el) => {
      if (el.name.includes('Pierre')) {
        this.rocks.push(el)
        el.material.transparent = true
      }
      if (el.name == "WaterSurface") {
        this.water = el;
        el.material = new WaterMaterial({
          uniforms: {
            uTexture: { value: el.material.map },
            uTime: { value: 0 },
          },
          transparent: true,
          depthWrite: false,
        });
      }
    });
    this.water.renderOrder = 0;
    app.webgl.shake.initShake(this.scene);

    this.light = new AmbientLight({ color: 0xffffff });
    this.add(this.light);

    this.spirit = new Spirit();
    this.spirit.position.set(5.5, 0.7, 2)
    this.add(this.spirit);

    this.add(this.scene);
    this.anim = new CamAnim(3, this.scene, [0, 0.25, 0.5, 0.75, 1, 1, 1]);

    if (app.webgl.currentScene === 3) this.init();

    this.vegetation = new Vegetation("dam");
    this.add(this.vegetation);
  }

  init() {
    if (DEV_MODE) {
      this.pane = new Pane({ title: "Parameters Dam", expanded: false });
      this.pane
        .addBinding(this.PARAMS, "sceneRot", {
          min: -180,
          max: 180,
          step: 0.1,
        })
        .on("change", (ev) => {
          this.scene.rotation.set(
            ev.value.x / (180 / Math.PI),
            ev.value.y / (180 / Math.PI),
            ev.value.z / (180 / Math.PI)
          );
        });
      this.pane
        .addBinding(this.PARAMS, "scenePos", {
          min: -10,
          max: 10,
          step: 0.1,
        })
        .on("change", (ev) => {
          this.scene.position.set(ev.value.x, ev.value.y, ev.value.z);
        });
      this.pane
        .addBinding(this.PARAMS, "persoPos", {
          min: -10,
          max: 10,
          step: 0.01,
        })
        .on("change", (ev) => {
          this.player.position.set(ev.value.x, ev.value.y, ev.value.z);
        });
      this.pane
        .addBinding(this.PARAMS, "spiritPos", {
          min: -10,
          max: 10,
          step: 0.1,
        })
        .on("change", (ev) => {
          this.spirit.position.set(ev.value.x, ev.value.y, ev.value.z);
        });
    }

    app.audio.playMusic(MUSIC_IDS.AMBIENT_LAKE);
    app.webgl.shake.startShake();

    this.milo = new Milo();
    this.player = this.milo.model;
    this.player.position.set(
      this.PARAMS.persoPos.x,
      this.PARAMS.persoPos.y,
      this.PARAMS.persoPos.z
    );
    // this.player.scale.set(0.15, 0.15, 0.15);
    this.add(this.player);

    this.duranceTex = app.assetsManager.get("duranceSide");
    this.durance = new Durance(this.duranceTex);
    this.durance.hide();
    this.durance.scale.set(2.5, 2.5, 2.5);
    this.durance.position.set(1.5, 0, 0);
    this.durance.renderOrder = 1;
    this.add(this.durance);

    this.player.goTo(new Vector3(4.3, this.PARAMS.persoPos.y, 5.6), 7);
    setTimeout(()=>{
      state.emit(EVENTS.GO_NEXT)
    }, 6000)
  }

  onPointerDown(e) {
    if (app.webgl.currentScene != 3) return;
    if (this.anim.currentKeyfame != 2) return;

    if(!this.isTutoPass) {
      this.isTutoPass = true;
      state.emit(EVENTS.TUTO_PASS, 3);
    }

    this.raycaster.setFromCamera(e.webgl, app.webgl.camera);

    const intersects = this.raycaster.intersectObjects(this.rocks);

    if (intersects.length != 0) {
      this.nbClick++;

      intersects.forEach((el)=>{
        gsap.to(el.object.material, {
          opacity: 0,
          onComplete: () => {
            el.object.visible = false
            this.rocks = this.rocks.filter((rock) => rock.name != el.object.name)
            if(this.rocks.length == 0 && !this.isInteractionFini){
              this.isInteractionFini = true
              state.emit(EVENTS.GO_NEXT)
              gsap.to(this.spirit.position, {
                x: 5.5,
                y: 0.8,
                z: 2.4,
              })
            }
          }
        })
      })
    }
  }

  onTick() {
    if (app.sceneshandler.currentScene != 3) return;
    if (this.water)
      this.water.material.uniforms.uTime.value = app.ticker.elapsed;
    if (app.sceneshandler.currentStepCam == 3 && !this.durance.isActive) {
      this.durance.isActive = true;
      app.audio.layers.playVolumes([1, 0, 0, 0, 1, 0, 0, 1, 0, 1, 0]);
      this.durance.show();
    }
    if (app.sceneshandler.currentStepCam == 5 && this.durance.isActive) {
      this.durance.isActive = false;
      this.durance.hide();
    }

    //Move Milo after interraction
    if (this.anim.currentKeyfame === 3 && !this.miloHasMove) {
      this.miloHasMove = true
      this.player.goTo(
        new Vector3(5.7, this.PARAMS.persoPos.y, 1.8),
        7,
        -Math.PI / 2
      );
    }


    // if (this.anim.currentKeyfame === 5 && !this.isAfterDialogues) {
    //   this.isAfterDialogues = true
    //   setTimeout(()=>{
    //     state.emit(EVENTS.GO_NEXT)
    //   }, 2000)
    // }

    if (this.anim.currentKeyfame === 6 && !this.isAfterCairn) {
      this.isAfterCairn = true
      setTimeout(()=>{
        state.emit(EVENTS.GO_NEXT)
      }, 2000)
    }
  }

  clear() {
    if (DEV_MODE) {
      this.pane.dispose();
    }
    app.webgl.shake.stopShake();
    app.audio.fadeOutAmbient();
  }
}

export { Dam };
