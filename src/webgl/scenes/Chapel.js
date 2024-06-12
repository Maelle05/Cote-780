import { Scene, MeshMatcapMaterial, RepeatWrapping } from "three";
import { state } from "../../utils/State";
import { Pane } from "tweakpane";
import { DEV_MODE } from "../../utils/constants/config";
import { CamAnim } from "../utils/CamAnim";
import Flame from "../objects/Flame";
import Spirit from "../objects/Spirit";
import { Raycaster } from "three";
import { Mesh } from "three";
import { Group } from "three";
import gsap from "gsap";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { app } from "@/App";
import { PortalMaterial } from "../materials/Portal/material";
import { AmbientLight } from "three";
import { WaterMaterial } from "../materials/Water/material";
import { DirectionalLight } from "three";
import { MUSIC_IDS } from "@/utils/core/audio/AudioManager";
import Milo from "../objects/Milo";
import { Vector3 } from "three";

class Chapel extends Scene {
  constructor() {
    super();
    state.register(this);

    this.PARAMS = {
      portalProgress: 0,
      posPerso: {
        x: -1,
        y: 1.05,
        z: 0,
      },
    };

    this.raycaster = new Raycaster();

    this.light = new AmbientLight({ color: 0xffffff });
    this.add(this.light);

    this.directionLight = new DirectionalLight(0xffffff);
    this.directionLight.intensity = 2;
    this.directionLight.position.set(7, 10, 15);
    this.add(this.directionLight);

    this.torchs = [];
    this.flames = [];
    this.flameOffset = 0.15;
  }

  init() {
    if (DEV_MODE) {
      this.pane = new Pane({ title: "Parameters Chapel", expanded: true });

      this.pane
        .addBinding(this.PARAMS, "portalProgress", {
          min: 0,
          max: 1,
          step: 0.001,
        })
        .on("change", (ev) => {
          this.portal.material.uniforms.uProgress.value = ev.value;
        });

      this.pane
        .addBinding(this.PARAMS, "posPerso", {
          min: -10,
          max: 10,
          step: 0.01,
        })
        .on("change", (ev) => {
          this.player.position.set(ev.value.x, ev.value.y, ev.value.z);
        });
    }

    this.milo = new Milo();
    this.player = this.milo.model;
    // this.player.rotation.y = 0;
    this.player.position.set(-0.33, 1.05, 0.55);
    this.add(this.player);

    this.spirit.position.set(-1, this.torchs[0].position.y + 0.4, 0);

    this.index = 0;
    this.isAnimating = false;

    app.audio.playMusic(MUSIC_IDS.AMBIENT_LAKE);
  }

  onAttach() {
    this.ambient = new AmbientLight({ color: 0xffffff });

    this.chapel = app.assetsManager.get("chapel");
    this.portalTexture = app.assetsManager.get("doorTexture");
    const noiseText = app.assetsManager.get("doorNoise");
    noiseText.wrapS = RepeatWrapping;
    noiseText.wrapT = RepeatWrapping;

    this.chapel.traverse((el) => {
      if (el.name == "WaterSurface") {
        this.water = el;
        el.material = new WaterMaterial({
          uniforms: {
            uTexture: { value: el.material.map },
            uTime: { value: 0 },
          },
          // transparent: true,
        });
      }

      if (el.name == "Portal") {
        this.portal = el;

        el.material = new PortalMaterial({
          uniforms: {
            uProgress: { value: 0 },
            uTexture: { value: this.portalTexture },
            uNoiseTexture: { value: noiseText },
            uTime: { value: 0 },
          },
          transparent: true,
        });
      }
    });
    this.add(this.chapel, this.ambient);

    this.torchs = this.chapel.children.filter((child) =>
      child.name.includes("Torch")
    );

    this.torchs.forEach((torch, index) => {
      const flame = new Flame();
      flame.position.set(
        torch.position.x,
        torch.position.y + 0.01,
        torch.position.z
      );

      torch.flame = flame;
      // flame.lookAt(app.webgl.camera.position);
      flame.visible = false;
      this.flames.push(flame);
      this.add(flame);
    });

    this.spirit = new Spirit();
    this.add(this.spirit);

    this.anim = new CamAnim(5, this.chapel, [0, 0.33, 0.66, 0.66, 1, 1]);
    // this.anim.onChangeSceneStep(2);

    if (!this.anim) {
      const controls = new OrbitControls(
        app.webgl.camera,
        app.webgl.renderer.domElement
      );
    }

    if (app.webgl.currentScene === 5) this.init();
  }

  onPointerDown(e) {
    if (app.webgl.currentScene != 5) return;
    if (this.isAnimating === true) return;
    // if (this.anim.currentKeyfame != 2) return;

    this.raycaster.setFromCamera(e.webgl, app.webgl.camera);
    const intersects = this.raycaster.intersectObjects(this.torchs);

    if (intersects.length != 0) {
      const flame = intersects[0].object.flame;

      if (flame.visible == true) return;

      this.index++;
      this.goTo(flame.position, flame);
      this.isAnimating = true;
    }

    //Create the portal & give the cairn when all torchs are on
  }

  goTo(position, flame) {
    //Spirit Anim
    const startPoint = {
      x: this.spirit.position.x,
      y: this.spirit.position.y,
      z: this.spirit.position.z,
    };
    const endPoint = {
      x: position.x,
      y: position.y + this.flameOffset + 0.2,
      z: position.z,
    };
    const controlPoint = {
      x: (startPoint.x + 1 + endPoint.x) / 2,
      y: startPoint.y + 0.7,
      z: (startPoint.z + 1 + endPoint.z) / 2,
    };

    const duration = 1;

    function bezierInterpolation(t, p0, p1, p2) {
      const x =
        (1 - t) * (1 - t) * p0.x + 2 * (1 - t) * t * p1.x + t * t * p2.x;
      const y =
        (1 - t) * (1 - t) * p0.y + 2 * (1 - t) * t * p1.y + t * t * p2.y;
      const z =
        (1 - t) * (1 - t) * p0.z + 2 * (1 - t) * t * p1.z + t * t * p2.z;
      return { x, y, z };
    }

    gsap.to(
      { t: 0 },
      {
        t: 1,
        duration: duration,
        ease: "power1.inOut",
        onUpdate: function (e) {
          const t = this.targets()[0].t;

          const newPosition = bezierInterpolation(
            t,
            startPoint,
            controlPoint,
            endPoint
          );
          e.position.set(newPosition.x, newPosition.y, newPosition.z);
        },
        onComplete: () => {
          this.isAnimating = false;
          if (!flame) return;
          flame.visible = true;
          flame.show();
          this.spiritStand(flame);

          if (this.index == this.torchs.length - 4) {
            this.isAnimating = true;
            //TODO : PLAY THE CAIRN ANIMATION THEN CREATE PORTAL
            this.createPortal();
            app.audio.layers.playVolumes([0, 0, 0, 0.3, 0, 0, 0, 0, 0, 0, 0]);
          }
        },
        onUpdateParams: [this.spirit], // Pass the spirit object to onUpdate
      }
    );
  }

  createPortal() {
    const tl = gsap.timeline();

    tl.to(this.portal.material.uniforms.uProgress, {
      value: 1,
      duration: 2,
      delay: 1,
      ease: "power2.in",
    });

    //Move the spirit
    const portalPos = new Vector3(0.34, 1.05, -0.15);
    const lookAtPos = new Vector3(0.3, 1.05, -0.17);
    const spiritPos = new Vector3(0.83, 1.05, -0.3);
    this.goTo(spiritPos);

    //Move Milo & Spirit
    //TODO : FIRE WHEN DIALOG SKIP
    const animDuration = 4;

    setTimeout(() => {
      this.player.goTo(portalPos, animDuration);

      setTimeout(() => {
        this.player.lookAt(this.portal.position);
        // this.player.goTo(lookAtPos, 1);
      }, animDuration * 1000);
    }, 4000);
  }

  spiritStand(object) {
    //TODO : CHANGE THIS ANIMATION
    // gsap.to(this.spirit.rotation, {
    //   duration: 2,
    //   repeat: -1,
    //   ease: "none",
    //   y: Math.PI * 2,
    //   onUpdate: () => {
    //     const angle = this.spirit.rotation.y;
    //     const radius = 0.1;
    //     const newX = object.position.x + Math.cos(angle) * radius;
    //     const newZ = object.position.z + Math.sin(angle) * radius;
    //     // Update the object position
    //     this.spirit.position.set(newX, object.position.y, newZ);
    //   },
    // });
  }

  onTick(e) {
    if (app.webgl.currentScene != 5) return;

    if (!this.portal) return;

    this.portal.material.uniforms.uTime.value += e.dt;
    this.water.material.uniforms.uTime.value = app.ticker.elapsed;
  }

  clear() {
    if (DEV_MODE) {
      this.pane.dispose();
    }

    this.torchs.forEach((torch) => {
      torch.flame.hide();
    });

    this.portal.material.uniforms.uProgress.value = 0;

    app.audio.fadeOutAmbient();
  }
}

export { Chapel };
