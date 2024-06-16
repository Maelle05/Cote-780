import {
  Scene,
  MeshMatcapMaterial,
  MeshBasicMaterial,
  DirectionalLight,
  Group,
  CanvasTexture,
  Raycaster,
  AmbientLight,
  PlaneGeometry,
  DoubleSide,
} from "three";
import { state } from "../../utils/State";
import { Pane } from "tweakpane";
import { HeaddressesMaterial } from "../materials/Headdresses/material";
import { gsap } from "gsap";
import { DEV_MODE } from "../../utils/constants/config";
import { EVENTS } from "../../utils/constants/events";
import { CamAnim } from "../utils/CamAnim";
import { app } from "@/App";
import Vegetation from "../objects/Vegetation";
import { Mesh } from "three";
import { TearsMaterial } from "../materials/Tears/material";
import { Vector3 } from "three";
import { MUSIC_IDS } from "@/utils/core/audio/AudioManager";
import Milo from "../objects/Milo";
import Birds from "../objects/Birds";

class Demoiselle extends Group {
  constructor(body, top, riseTop) {
    super();
    state.register(this);

    this.raycaster = new Raycaster();

    // Canvas texture
    this.sizeCanvas = 300;
    this.canvas = document.createElement("canvas");
    this.canvas.width = this.sizeCanvas;
    this.canvas.height = this.sizeCanvas;
    this.ctx = this.canvas.getContext("2d", { willReadFrequently: true });
    this.ctx.fillStyle = `black`;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    // document.querySelector('#vue-app').appendChild(this.canvas)

    this.baseTexture = top.material.map;
    this.canvasTex = new CanvasTexture(this.canvas);
    top.material = new HeaddressesMaterial({
      uniforms: {
        uBaseTex: { value: this.baseTexture },
        uMaskTex: { value: this.canvasTex },
        u_gAlpha: { value: 0 },
      },
    });

    this.body = body;
    this.top = top;
    this.riseTop = riseTop;
    this.topIsDraw = false;
    this.isElHit = false;
  }

  onPointerMove(e) {
    if (this.topIsDraw) return;
    if (app.webgl.currentScene != 2) return;
    if (app.webgl.scene.anim.currentKeyfame != 3) return;

    // update the picking ray with the camera and pointer position
    this.raycaster.setFromCamera(e.webgl, app.webgl.camera);

    // calculate objects intersecting the picking ray
    const intersects = this.raycaster.intersectObject(this.top);

    for (let i = 0; i < intersects.length; i++) {
      if (!this.isElHit) this.isElHit = true;
      intersects[i].object.material.opacity = 1;
      this.drawOnCanvasTex(intersects[i].uv);
    }

    if (this.isCanvasPainted()) {
      this.ctx.fillStyle = `white`;
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      this.topIsDraw = true;

      gsap.to(this.top.position, {
        x: this.body.position.x,
        y: this.body.position.y + this.riseTop,
        z: this.body.position.z,
      });

      app.sceneshandler.webgl.scene.drawCount++;

      app.audio.ui.play(`hat_${app.sceneshandler.webgl.scene.drawCount}`, 0.5);
    }
  }

  drawOnCanvasTex(coords) {
    const radius = 10;
    const x = coords.x * this.sizeCanvas;
    const y = coords.y * this.sizeCanvas;
    const color = `white`;

    this.ctx.beginPath();
    this.ctx.arc(x, y, radius, 0, 2 * Math.PI);
    this.ctx.fillStyle = color;
    this.ctx.fill();

    // Create a texture from the canvas
    this.canvasTex.needsUpdate = true;
  }

  isCanvasPainted() {
    const imageData = this.ctx.getImageData(
      0,
      0,
      this.canvas.width,
      this.canvas.height
    );

    const data = imageData.data;

    const results = [];

    for (let i = 0; i < data.length; i += 4) {
      if (data[i + 0] > 200) {
        results.push(true);
      } else {
        results.push(false);
      }
    }

    const note = results.filter((el) => el == true).length / results.length;

    if (note > 0.1) {
      return true; // Canvas painted
    } else {
      return false;
    }
  }
}

class Ladies extends Scene {
  drawCount = 0;

  constructor() {
    super();
    state.register(this);

    this.PARAMS = {
      scenePos: {
        x: -2.6,
        y: -1.0,
        z: 0.9,
      },
      miloPos: {
        x: 8.3,
        y: 0.0,
        z: -5.2,
      },
      rotateY: -86.1,
      rotateX: -3.9,
    };

    this.finish = false;
    this.isTutoPass = false;

    this.light = new AmbientLight({ color: 0xffffff });
    this.add(this.light);

    this.directionLight = new DirectionalLight(0xffffff);
    this.directionLight.intensity = 2;
    this.directionLight.position.set(7, 10, 15);
    this.add(this.directionLight);
  }

  init() {
    if (DEV_MODE) {
      this.pane = new Pane({ title: "Parameters Ladies", expanded: true });
      this.pane
        .addBinding(this.PARAMS, "rotateY", {
          min: -180,
          max: 180,
          step: 0.1,
        })
        .on("change", (ev) => {
          this.ladies.rotation.y = ev.value / (180 / Math.PI);
        });
      this.pane
        .addBinding(this.PARAMS, "rotateX", {
          min: -180,
          max: 180,
          step: 0.1,
        })
        .on("change", (ev) => {
          this.ladies.rotation.x = ev.value / (180 / Math.PI);
        });
      this.pane
        .addBinding(this.PARAMS, "scenePos", {
          min: -10,
          max: 10,
          step: 0.1,
        })
        .on("change", (ev) => {
          this.ladies.position.set(ev.value.x, ev.value.y, ev.value.z);
        });
      this.pane
        .addBinding(this.PARAMS, "miloPos", {
          min: -10,
          max: 10,
          step: 0.1,
        })
        .on("change", (ev) => {
          this.player.position.set(ev.value.x, ev.value.y, ev.value.z);
        });
      this.pane
        .addBinding(
          app.webgl.transitionPass.material.uniforms.uProgress,
          "value",
          {
            min: 0,
            max: 1,
            step: 0.001,
            label: "Transition progress",
          }
        )
        .on("change", (ev) => {
          this.transitionPass.material.uniforms.uProgress.value = ev.value;
        });
      this.pane
        .addBinding(this.tears, "position", {
          min: -10,
          max: 10,
          step: 0.1,
        })
        .on("change", (ev) => {
          this.tears.position.set(ev.value.x, ev.value.y, ev.value.z);
        });
    }

    app.audio.playMusic(MUSIC_IDS.AMBIENT_LADIES);
    app.webgl.shake.startShake();

    this.milo = new Milo();
    this.player = this.milo.model;
    this.player.position.set(8.37, -0.04, -5.2);
    this.player.scale.set(0.06, 0.06, 0.06);
    this.player.rotation.y = (-130 * Math.PI) / 180;

    this.add(this.player);
  }

  onTick() {
    if (app.sceneshandler.currentScene != 2) return;

    if (this.tears && this.tears.userData.isActive) {
      this.tears.lookAt(app.webgl.camera.position);
      this.tears.material.uniforms.u_time.value = app.ticker.elapsed * 0.001;

      if (app.sceneshandler.currentStepCam == 3) {
        this.tears.userData.isActive = false;
        this.tears.material.uniforms.u_gAlpha.value = 0;
      }
    }

    if (this.dem1.isElHit || this.dem2.isElHit || this.dem3.isElHit) {
      this.isTutoPass = true;
      state.emit(EVENTS.TUTO_PASS, 2);
    }
    if (app.sceneshandler.currentStepCam == 3 && !this.isTutoPass) {
      this.demoiselles.children.forEach((dem) => {
        dem.top.material.uniforms.u_gAlpha.value =
          (Math.sin(app.ticker.elapsed * 0.005) * 0.5 + 0.5) * 0.4;
      });
    } else if (app.sceneshandler.currentStepCam == 3 && this.isTutoPass) {
      this.demoiselles.children.forEach((dem) => {
        dem.top.material.uniforms.u_gAlpha.value = 0;
      });
    }
  }

  onPointerMove() {
    if (
      this.dem1.topIsDraw &&
      this.dem2.topIsDraw &&
      this.dem3.topIsDraw &&
      !this.finish
    ) {
      state.emit(EVENTS.GO_NEXT);
      this.finish = true;
      app.audio.layers.playVolumes([0, 0.5, 0, 0, 0, 0, 0, 0.5, 0, 0, 0]);
    }
  }

  onAttach() {
    this.demoiselles = new Group();
    this.D1 = [];
    this.D2 = [];
    this.D3 = [];

    this.ambient = new AmbientLight({ color: 0xffffff, intensity: 0.1 });

    this.ladies = app.assetsManager.get("ladies");
    this.ladies.traverse((el) => {
      if (el.name == "dame1" || el.name == "top1") {
        this.D1.push(el);
      }
      if (el.name == "dame2" || el.name == "top2") {
        this.D2.push(el);
      }
      if (el.name == "dame3" || el.name == "top3") {
        this.D3.push(el);
      }
    });

    this.vegetation = new Vegetation("ladies");
    this.add(this.vegetation);

    this.birds = new Birds(this.ladies.getObjectByName("BirdStart").position, this.ladies.getObjectByName("BirdEnd").position, true);
    this.add(this.birds);

    this.dem1 = new Demoiselle(this.D1[0], this.D1[1], 0.9);
    this.dem2 = new Demoiselle(this.D2[0], this.D2[1], 1.2);
    this.dem3 = new Demoiselle(this.D3[0], this.D3[1], 1.2);
    this.demoiselles.add(this.dem1, this.dem2, this.dem3);

    this.tears = new Mesh(
      new PlaneGeometry(0.2, 0.2),
      new TearsMaterial({
        uniforms: {
          u_color: { value: new Vector3(0.27, 0.39, 0.36) },
          u_time: { value: app.ticker.elapsed * 0.001 },
          u_gAlpha: { value: 1 },
        },
      })
    );
    this.tears.userData.isActive = true;
    this.tears.position.set(2.05, 2.84, 1.7);

    this.anim = new CamAnim(2, this.ladies, [0, 0, 0.25, 0.5, 1, 1, 1]);
    // this.anim.onChangeSceneStep(3);

    this.add(this.ladies, this.ambient, this.tears);
    app.webgl.shake.initShake(this.ladies);

    if (app.webgl.currentScene === 2) this.init();
  }

  onAskRemoveTransition() {
    if (app.sceneshandler.currentScene != 2) return;

    setTimeout(() => {
      state.emit(EVENTS.GO_NEXT);
    }, 3000);
  }

  clear() {
    if (DEV_MODE) {
      this.pane.dispose();
    }

    app.audio.fadeOutAmbient();
    app.webgl.shake.stopShake();
  }
}

export { Ladies };
