import { Renderer } from "./Renderer";
import { state } from "../utils/State";
import { DEV_MODE, INIT_SCENE } from "../utils/constants/config";
import Stats from "three/examples/jsm/libs/stats.module";
import { Camera } from "./Camera";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';

// Scenes
import { Intro } from "./Scenes/Intro";
import { Map } from "./Scenes/Map";
import { Ladies } from "./Scenes/Ladies";
import { Bridge } from "./Scenes/Bridge";
import { Dam } from "./Scenes/Dam";
import { Chapel } from "./Scenes/Chapel";
import { Village } from "./Scenes/Village";
import { End } from "./Scenes/End";

export default class WebglController {
  constructor(container) {
    state.register(this);

    // Webgl
    this.canvasWrapper = container;
    this.camera = new Camera();
    this.renderer = new Renderer(this.canvasWrapper, 0x988c86, 1);

    // Controls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    this.allScene = [
      new Intro(),
      new Map(),
      new Ladies(),
      new Dam(),
      new Bridge(),
      new Chapel(),
      new Village(),
      new End(),
    ];
    this.currentScene = INIT_SCENE;
    this.scene = this.allScene[this.currentScene];
    this.scene.init();

    // Post pros
    this.effectComposer = new EffectComposer(this.renderer);
    this.effectComposer.setPixelRatio(window.devicePixelRatio);
    this.effectComposer.setSize(this.canvasWrapper.offsetWidth, this.canvasWrapper.offsetHeight);
    this.renderPass = new RenderPass(this.scene, this.camera)
    this.effectComposer.addPass(this.renderPass)
  }

  initStats() {
    if (DEV_MODE) {
      this.stats = new Stats();
      this.canvasWrapper.appendChild(this.stats.dom);
    }
  }

  onAttach() {
    // console.log('Event onAttach')
    // clear canvas
    this.canvasWrapper.innerHTML = "";
    // add canvas to dom
    this.initStats();
    this.canvasWrapper.appendChild(this.renderer.domElement);
    this.onRender();
  }

  // UPDATE AND RENDER
  onTick() {
    // console.log('Event onTick')
  }

  onRender() {
    // console.log('Event onRender')

    // update monitoring performances
    if (this.stats && DEV_MODE) this.stats.update();

    // render
    if (this.effectComposer) {
      this.renderPass.camera = this.camera
      this.effectComposer.render();
    }
  }

  onChangeScene(e) {
    this.currentScene = e;
    // this.camera = new Camera();
    // this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    // this.controls.enabled = true;
    // this.controls.reset();
    this.scene.clear();
    this.scene = this.allScene[this.currentScene];
    this.renderPass.scene = this.scene
    this.scene.init();
  }
}
