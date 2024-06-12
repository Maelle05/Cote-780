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

class ColorSpirit extends Spirit {
  constructor() {
    super();

    this.allPos = [
      { x: 5.8, y: 0.7, z: 1.9 },
      { x: 5, y: 1, z: 1 },
      { x: 5.5, y: 0.8, z: 2.4 },
    ];
    this.currentPos = 2;
    this.currentLife = 4;
    this.isCaptured = false;

    this.allColors = [
      new Color(0xacc8e4),
      new Color(0x809bbf),
      new Color(0x53a0ec),
      new Color(0x1a80e6),
    ];

    this.position.set(
      this.allPos[this.currentPos].x,
      this.allPos[this.currentPos].y,
      this.allPos[this.currentPos].z
    );

    this.tl = gsap.timeline({
      onComplete: () => {
        this.changePos();
      },
    });
    this.tl.to(this.material, { opacity: 1, duration: 0.3 });
    this.tl.to(this.material, { opacity: 0.2, duration: 1 });
    this.tl.to(this.material, { opacity: 1, duration: 1 });
    this.tl.to(this.material, { opacity: 0, duration: 1 });

    this.anim();
  }

  anim() {
    if (this.isCaptured) return;
    this.tl.restart();
    this.tl.play();
  }

  updateLife() {
    this.isOnTransit = true;
    this.currentLife = this.currentLife - 1;
    switch (this.currentLife) {
      case 3:
        this.targetSpiritColor = new Vector4(
          this.allColors[0].r,
          this.allColors[0].g,
          this.allColors[0].b,
          1
        );
        this.changePos();
        break;

      case 2:
        this.targetSpiritColor = new Vector4(
          this.allColors[1].r,
          this.allColors[1].g,
          this.allColors[1].b,
          1
        );
        this.changePos();
        break;

      case 1:
        this.targetSpiritColor = new Vector4(
          this.allColors[2].r,
          this.allColors[2].g,
          this.allColors[2].b,
          1
        );
        this.changePos();
        break;

      case 0:
        this.targetSpiritColor = new Vector4(
          this.allColors[3].r,
          this.allColors[3].g,
          this.allColors[3].b,
          1
        );
        this.isCaptured = true;
        state.emit(EVENTS.GO_NEXT);
        break;

      default:
        break;
    }
  }

  changePos() {
    if (app.webgl.currentScene != 3) return;
    this.hide();
    setTimeout(() => {
      this.currentPos = (this.currentPos + 1) % this.allPos.length;
      this.position.set(
        this.allPos[this.currentPos].x,
        this.allPos[this.currentPos].y,
        this.allPos[this.currentPos].z
      );
      this.show();
      this.anim();
    }, 700);
  }
}

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
  }

  onAttach() {
    this.scene = app.assetsManager.get("dam");
    this.scene.traverse((el) => {
      if (el.name == "WaterSurface") {
        this.water = el;
        el.material = new WaterMaterial({
          uniforms: {
            uTexture: { value: el.material.map },
            uTime: { value: 0 },
          },
          transparent: true,
          depthWrite: false,
          // depthTest: false
        });
      }
    });
    this.water.renderOrder = 0;

    this.light = new AmbientLight({ color: 0xffffff });
    this.add(this.light);

    // this.milo = new Milo();
    // this.player = this.milo.model;
    // this.player.position.set(
    //   this.PARAMS.persoPos.x,
    //   this.PARAMS.persoPos.y,
    //   this.PARAMS.persoPos.z
    //   );
    //   // this.player.scale.set(0.15, 0.15, 0.15);
    //   this.add(this.player);

    this.spirit = new ColorSpirit();
    this.add(this.spirit);

    this.add(this.scene);

    this.rocks = app.assetsManager.get("rocks");
    this.rocks.traverse((el) => {
      el.material = new MeshMatcapMaterial({
        matcap: app.assetsManager.get("matcap"),
        transparent: true,
      });

      el.visible = false;
    });
    this.rocks.position.set(
      this.PARAMS.rocksPos.x,
      this.PARAMS.rocksPos.y,
      this.PARAMS.rocksPos.z
    );
    this.rocks.scale.set(1.5, 1.5, 1.5);
    this.add(this.rocks);

    this.anim = new CamAnim(3, this.scene, [0, 0.25, 0.5, 0.5, 0.75, 1]);

    if (app.webgl.currentScene === 3) this.init();
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
      this.pane
        .addBinding(this.PARAMS, "rocksPos", {
          min: -10,
          max: 10,
          step: 0.1,
        })
        .on("change", (ev) => {
          this.rocks.position.set(ev.value.x, ev.value.y, ev.value.z);
        });
    }

    app.audio.playMusic(MUSIC_IDS.AMBIENT_LAKE);

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
  }

  onPointerDown(e) {
    if (app.webgl.currentScene != 3) return;

    //Move Milo after interraction
    if (this.anim.currentKeyfame === 3) {
      this.player.goTo(
        new Vector3(5.7, this.PARAMS.persoPos.y, 1.8),
        7,
        -Math.PI / 2
      );
    }

    if (this.anim.currentKeyfame != 3) return;

    this.raycaster.setFromCamera(e.webgl, app.webgl.camera);
    const intersects = this.raycaster.intersectObject(this.spirit);

    if (intersects.length != 0) {
      this.nbClick = this.nbClick + 2;
      this.spirit.updateLife();
      if (this.spirit.isCaptured) {
        gsap.to(this.spirit.position, {
          x: this.player.position.x,
          y: this.player.position.y,
          z: this.player.position.z,
        });

        gsap.to(this.spirit.scale, {
          x: 0,
          y: 0,
          z: 0,
        });
      }

      gsap.to(
        this.rocks.children.find(
          (el) => el.name === "Pierre" + (this.nbClick - 1)
        ).material,
        {
          opacity: 0,
        }
      );
      gsap.to(
        this.rocks.children.find((el) => el.name === "Pierre" + this.nbClick)
          .material,
        {
          opacity: 0,
        }
      );
    }
  }

  onTick() {
    if (app.sceneshandler.currentScene != 3) return;
    if (this.water)
      this.water.material.uniforms.uTime.value = app.ticker.elapsed;
    if (app.sceneshandler.currentStepCam == 4 && !this.durance.isActive) {
      this.durance.isActive = true;
      app.audio.layers.playVolumes([1, 0, 0, 0, 1, 0, 0, 1, 0, 1, 0]);
        this.durance.show();
    }
    if (app.sceneshandler.currentStepCam == 5 && this.durance.isActive) {
      this.durance.isActive = false;
      this.durance.hide();
    }
  }

  clear() {
    if (DEV_MODE) {
      this.pane.dispose();
    }

    app.audio.fadeOutAmbient();
  }
}

export { Dam };
