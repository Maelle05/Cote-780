import { Renderer } from "./Renderer";
import { state } from "../utils/State";
import { DEV_MODE, INIT_SCENE } from "../utils/constants/config";
import Stats from "three/examples/jsm/libs/stats.module";
import { Camera } from "./Camera";

// Post pros
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { GammaCorrectionShader } from "three/examples/jsm/shaders/GammaCorrectionShader.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";

// Scenes
import { Intro } from "./scenes/Intro";
import { Map } from "./scenes/Map";
import { Ladies } from "./scenes/Ladies";
import { Bridge } from "./scenes/Bridge";
import { Dam } from "./scenes/Dam";
import { Chapel } from "./scenes/Chapel";
import { Village } from "./scenes/Village";
import { End } from "./scenes/End";
import { TransitionPass } from "./pass/TransitionPass/TransitionPass";
import { app } from "@/App";
import { RepeatWrapping, Vector4 } from "three";
import gsap from "gsap";
import { EVENTS } from "@/utils/constants/events";
import { RenderTarget } from "three";
import { WaterPass } from "./pass/WaterPass/TransitionPass";
import { Shake } from "./utils/Shake";
import { Null } from "./UI/Null";

export default class WebglController {
  constructor(container) {
    state.register(this);

    // Webgl
    this.canvasWrapper = container;
    this.camera = new Camera();
    this.renderer = new Renderer(this.canvasWrapper, 0x988c86, 1);

    this.allScene = [
      new Intro(),
      new Null(),
      new Ladies(),
      new Dam(),
      new Bridge(),
      new Chapel(),
      new Village(),
      new End(),
    ];
    this.currentScene = INIT_SCENE;
    this.scene = this.allScene[this.currentScene];
    // this.scene = new Bridge();

    // Post pros
    const renderTarget = new RenderTarget(0, 0, { samples: 4,  });
    this.effectComposer = new EffectComposer(this.renderer, renderTarget);
    this.effectComposer.setPixelRatio(window.devicePixelRatio);
    this.effectComposer.setSize(
      this.canvasWrapper.offsetWidth,
      this.canvasWrapper.offsetHeight
    );
    this.renderPass = new RenderPass(this.scene, this.camera, null, 0x988c86, 1);
    this.effectComposer.addPass(this.renderPass);
    this.waterPass = new ShaderPass(WaterPass);
    this.waterPass.material.uniforms.uResolution.value = new Vector4(
      this.canvasWrapper.offsetWidth,
      this.canvasWrapper.offsetHeight,
      1,
      1
    );
    if (this.currentScene == 6) {
      this.waterPass.material.uniforms.uIsWater.value = true;
    }
    this.effectComposer.addPass(this.waterPass);
    this.transitionPass = new ShaderPass(TransitionPass);
    this.transitionPass.material.uniforms.uResolution.value = new Vector4(
      this.canvasWrapper.offsetWidth,
      this.canvasWrapper.offsetHeight,
      1,
      1
    );
    this.effectComposer.addPass(this.transitionPass);
    this.gammaCorrectionPass = new ShaderPass(GammaCorrectionShader);
    this.effectComposer.addPass(this.gammaCorrectionPass);

    this.shake = new Shake();

    this.transitionPass.material.uniforms.uIsColor.value = true;
    this.transitionPass.material.uniforms.uProgress.value = 0;
  }

  initStats() {
    if (DEV_MODE) {
      this.stats = new Stats();
      this.canvasWrapper.appendChild(this.stats.dom);
    }
  }

  onAttach() {
    // clear canvas
    this.canvasWrapper.innerHTML = "";
    // add canvas to dom
    this.canvasWrapper.appendChild(this.renderer.domElement);
    this.onRender();
    this.initStats();

    const waterTex = app.assetsManager.get("water");
    waterTex.wrapS = waterTex.wrapT = RepeatWrapping;
    this.waterPass.material.uniforms.tWater.value = waterTex;
  }

  // UPDATE AND RENDER
  onTick() {
    // console.log('Event onTick')
    // console.log(this.camera.fov)
    this.transitionPass.material.uniforms.uTime.value = app.ticker.elapsed;
    this.waterPass.material.uniforms.uTime.value = app.ticker.elapsed;
  }

  onRender() {
    // console.log('Event onRender')

    // update monitoring performances
    if (this.stats && DEV_MODE) this.stats.update();

    // render
    if (this.effectComposer) {
      this.renderPass.camera = this.camera;
      this.effectComposer.render();
    }
  }

  onAskTransition() {
    app.webgl.transitionPass.material.uniforms.uIsColor.value = false;
    app.webgl.transitionPass.material.uniforms.uProgress.value = 0;
    gsap.to(app.webgl.transitionPass.material.uniforms.uProgress, {
      value: 1,
      duration: 3,
      ease: "circ.in"
    });
  }

  onChangeScene(e) {
    this.currentScene = e;
    this.scene.clear();
    if (this.currentScene == 0 || this.currentScene == 1) {
      this.camera = new Camera();
    }
    this.scene = this.allScene[this.currentScene];
    this.renderPass.scene = this.scene;
    this.scene.init();
    if (this.currentScene == 6) {
      this.waterPass.material.uniforms.uIsWater.value = true;
    } else {
      this.waterPass.material.uniforms.uIsWater.value = false;
    }
  }

  onAskRemoveTransition(){
    this.transitionPass.material.uniforms.uIsColor.value = true;
    this.transitionPass.material.uniforms.uProgress.value = 0;
    gsap.to(this.transitionPass.material.uniforms.uProgress, {
      delay: 0.3,
      value: 1,
      duration: 3,
      ease: "circ.in",
    });
  }

  onResize() {
    this.effectComposer.setSize(
      this.canvasWrapper.offsetWidth,
      this.canvasWrapper.offsetHeight
    );
    this.effectComposer.setPixelRatio(window.devicePixelRatio);
    this.transitionPass.material.uniforms.uResolution.value = new Vector4(
      this.canvasWrapper.offsetWidth,
      this.canvasWrapper.offsetHeight,
      1,
      1
    );
    this.waterPass.material.uniforms.uResolution.value = new Vector4(
      this.canvasWrapper.offsetWidth,
      this.canvasWrapper.offsetHeight,
      1,
      1
    );

    // console.log(this.transitionPass.material.uniforms.uResolution.value);
  }
}
