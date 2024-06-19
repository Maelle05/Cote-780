import {
  Scene,
  MeshMatcapMaterial,
  RepeatWrapping,
  Vector2,
  MathUtils,
  AnimationMixer,
} from "three";
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
import { AMBIENT_IDS, MUSIC_IDS } from "@/utils/core/audio/AudioManager";
import Milo from "../objects/Milo";
import { Vector3 } from "three";
import { ShakiraMaterial } from "../materials/Shakira/material";
import Vegetation from "../objects/Vegetation";
import { EVENTS } from "@/utils/constants/events";
import { ElectricPortalMaterial } from "../materials/ElectricPortal/material";
import SparkleParticles from "../objects/SparkleParticles";

class Chapel extends Scene {
  boats = [];
  boatAnims = [];
  animationMixers = [];
  animationClips = [];

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
      portalScale: {
        x: -1,
        y: 1.05,
        z: 0,
      },
      backPortalScale: {
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
    this.empties = [];
    this.flameOffset = 0.15;
    
    this.sparkles = new SparkleParticles();
    this.add(this.sparkles);
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
          this.backPortal.material.uniforms.uProgress.value = ev.value;
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

      this.pane
        .addBinding(this.PARAMS, "portalScale", {
          min: 0.1,
          max: 0.5,
          step: 0.01,
        })
        .on("change", (ev) => {
          this.portal.scale.set(ev.value.x, ev.value.y, ev.value.z);
        });
      this.pane
        .addBinding(this.PARAMS, "backPortalScale", {
          min: 0.1,
          max: 1.2,
          step: 0.01,
        })
        .on("change", (ev) => {
          this.backPortal.scale.set(ev.value.x, ev.value.y, ev.value.z);
        });

      this.pane
        .addBinding(
          app.webgl.transitionPass.material.uniforms.uProgress,
          "value",
          {
            min: 0,
            max: 1,
            step: 0.1,
          }
        )
        .on("change", (ev) => {
          app.webgl.transitionPass.material.uniforms.uProgress.value = ev.value;
        });
    }

    this.milo = new Milo();
    this.player = this.milo.model;
    this.player.position.set(-0.33, 1.05, 0.55);
    this.add(this.player);

    this.spirit.position.set(-1, this.torchs[0].position.y + 0.4, 0);

    this.index = 0;
    this.isAnimating = false;
    this.interpolatedMouse = new Vector2(0.5, 0.5);
    this.portal.material.uniforms.uProgress.value = 0;

    app.audio.playAmbient(AMBIENT_IDS.AMBIENT_CHAPEL);
    app.audio.playMusic(MUSIC_IDS.CLASSIC_LOOP);
    app.webgl.shake.startShake();
  }

  onAttach() {
    this.ambient = new AmbientLight({ color: 0xffffff });

    this.chapel = app.assetsManager.get("chapel");
    this.portalTexture = app.assetsManager.get("doorTexture");
    const noiseText = app.assetsManager.get("doorNoise");
    noiseText.wrapS = RepeatWrapping;
    noiseText.wrapT = RepeatWrapping;

    this.chapel.traverse((child) => {
      if (child.name.includes("BoatPos")) this.boats.push(child);
      if (child.name == "WaterSurface") {
        this.water = child;
        child.material = new WaterMaterial({
          uniforms: {
            uTexture: { value: child.material.map },
            uTime: { value: 0 },
          },
        });
      }

      if (child.name == "Portal") {
        this.portal = child;
        this.portal.scale.set(0.14, 0.2, 0.21);

        child.material = new PortalMaterial({
          uniforms: {
            uProgress: { value: 0 },
            uTexture: { value: this.portalTexture },
            uNoiseTexture: { value: noiseText },
            uTime: { value: 0 },
            uMouse: { value: app.mouse.coordinates.webgl },
            uResolution: { value: new Vector2(1, 1) },
          },
          transparent: true,
        });
      }

      if (child.name == "PortalBack") {
        this.backPortal = child;
        this.backPortal.scale.set(0.24, 1, 0.33);

        child.material = new ElectricPortalMaterial({
          uniforms: {
            uProgress: { value: 0 },
            uTexture: { value: this.portalTexture },
            uNoiseTexture: { value: noiseText },
            uTime: { value: 0 },
            uMouse: { value: app.mouse.coordinates.webgl },
            uResolution: { value: new Vector2(1, 1) },
          },
          transparent: true,
        });
      }

      if (child.name.includes("Empty")) {
        this.empties.push(child);
      }
    });

    this.boatAnims = this.chapel.animations.filter((el) =>
      el.name.includes("Boat")
    );
    this.boats.forEach((boat, index) => {
      const mixer = new AnimationMixer(boat);
      const clip = mixer.clipAction(this.boatAnims[index]);
      clip.play();
      this.animationMixers.push(mixer);
      this.animationClips.push(clip);
    });

    app.webgl.shake.initShake(this.chapel);
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

      torch.empty = this.empties[index];
      torch.flame = flame;
      // flame.lookAt(app.webgl.camera.position);
      flame.visible = false;
      this.flames.push(flame);
      this.add(flame);
    });

    this.spirit = new Spirit();
    this.add(this.spirit);

    this.anim = new CamAnim(5, this.chapel, [0, 0.33, 0.66, 0.66, 0.66, 1]);
    this.anim.onChangeSceneStep(0)

    if (!this.anim) {
      const controls = new OrbitControls(
        app.webgl.camera,
        app.webgl.renderer.domElement
      );
    }

    if (app.webgl.currentScene === 5) this.init();

    this.vegetation = new Vegetation("chapel");
    this.add(this.vegetation);
  }

  onAskRemoveTransition() {
    if (app.webgl.currentScene != 5) return;

    setTimeout(() => {
      state.emit(EVENTS.GO_NEXT);
    }, 4000);
  }

  onPointerDown(e) {
    if (app.webgl.currentScene != 5) return;
    if (this.isAnimating === true) return;
    if (this.anim.currentKeyfame != 2) return;

    this.raycaster.setFromCamera(e.webgl, app.webgl.camera);
    const intersects = this.raycaster.intersectObjects(this.torchs);

    if (!this.isTutoPass) {
      this.isTutoPass = true;
      state.emit(EVENTS.TUTO_PASS, 5);
    }

    if (intersects.length != 0) {
      const flame = intersects[0].object.flame;

      if (flame.visible == true) return;

      this.index++;
      this.goTo(intersects[0].object.empty.position, flame);
      this.sparkles.spawn(flame.position, 5);
      this.isAnimating = true;
    }

    //Create the portal & give the cairn when all torchs are on
  }

  onPointerMove(e) {
    if (this.anim.currentKeyfame != 2) return;

    this.raycaster.setFromCamera(e.webgl, app.webgl.camera);
    const intersects = this.raycaster.intersectObjects(this.torchs);

    if (intersects.length != 0) {
      document.body.style.cursor = "pointer";
    } else {
      document.body.style.cursor = "default";
    }
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
      y: position.y,
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
          app.audio.ui.play("torch");

          if (this.index == 5) {
            this.isAnimating = true;
            state.emit(EVENTS.GO_NEXT);
            this.createPortal();
            // app.audio.layers.playVolumes([0, 0, 0, 0.3, 0, 0, 0, 0, 0, 0, 0]);
            //TODO : PLAY THE CAIRN ANIMATION THEN CREATE PORTAL
          }
        },
        onUpdateParams: [this.spirit], // Pass the spirit object to onUpdate
      }
    );
  }

  createPortal() {
    // const tl = gsap.timeline();

    gsap.to(this.portal.material.uniforms.uProgress, {
      value: 1,
      duration: 2,
      ease: "power2.in",
    });

    gsap.to(this.backPortal.material.uniforms.uProgress, {
      value: 1,
      duration: 2,
      ease: "power2.in",
    });
  }

  onTick(e) {
    if (app.webgl.currentScene != 5) return;

    this.animationMixers.forEach((mixer) =>
      mixer.update(app.ticker.delta * 0.0001)
    );

    if (!this.endTransition && app.sceneshandler.currentStepCam == 5) {
      this.endTransition = true;
      const portalPos = new Vector3(0.34, 1.05, -0.15);
      const spiritPos = new Vector3(0.83, 1.25, -0.3);
      this.goTo(spiritPos);
      setTimeout(() => {
        const animDuration = 4;
        this.player.goTo(portalPos, animDuration);

        setTimeout(() => {
          gsap.to(this.player.rotation, {
            y: -Math.PI / 4,
            duration: 1,
          });
        }, animDuration * 1000);
      }, 2000);
    }

    if (!this.portal) return;

    this.portal.material.uniforms.uTime.value += e.dt;
    this.backPortal.material.uniforms.uTime.value += e.dt;
    this.water.material.uniforms.uTime.value = app.ticker.elapsed;

    //Parallax effect on portal
    const mouse = app.mouse.coordinates.webgl;
    const lerpFactor = 0.025;
    this.interpolatedMouse.x = MathUtils.lerp(
      this.interpolatedMouse.x,
      mouse.x,
      lerpFactor
    );
    this.interpolatedMouse.y = MathUtils.lerp(
      this.interpolatedMouse.y,
      mouse.y,
      lerpFactor
    );

    this.portal.material.uniforms.uMouse.value = this.interpolatedMouse;
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
    app.webgl.shake.stopShake();
  }
}

export { Chapel };
