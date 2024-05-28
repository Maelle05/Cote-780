import { Renderer } from "./Renderer";
import { state } from "./Utils/State";
import { AssetsManager } from "./Utils/Core/AssetsManager";
import { Ticker } from "./Utils/Core/Ticker";
import { Mouse } from "./Utils/Tools/Mouse";
import { Scroll } from "./Utils/Tools/Scroll";
import { Viewport } from "./Utils/Tools/Viewport";
import { Keyboard } from "./Utils/Tools/Keyboard";
import { EVENTS } from "./Constants/events";
import { DEV_MODE, INIT_SCENE } from "./Constants/config";
import Stats from "three/examples/jsm/libs/stats.module";
import { Camera } from "./Camera";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

// Scenes
import { Intro } from "./Scenes/Intro";
import { Map } from "./Scenes/Map";
import { Ladies } from "./Scenes/Ladies";
import { Bridge } from "./Scenes/Bridge";
import { Dam } from "./Scenes/Dam";
import { Chapel } from "./Scenes/Chapel";
import { Village } from "./Scenes/Village";
import { End } from "./Scenes/End"
import { AudioManager } from "./Utils/Core/Audio/AudioManager";

export default class WebglController {
  static instance = null;

  constructor(container) {
    // Singleton
    if (WebglController.instance) {
      return WebglController.instance;
    }
    WebglController.instance = this;

    state.register(this);

    // Core
    this.assetsManager = new AssetsManager();
    this.ticker = new Ticker();
    this.audio = new AudioManager();

    // Tools
    this.viewport = new Viewport(container);
    this.mouse = new Mouse(this.viewport);
    this.keyboard = new Keyboard();
    this.scroll = new Scroll(this.viewport);

    // Webgl
    this.canvasWrapper = container;
    this.renderer = new Renderer(this.canvasWrapper);
    this.camera = new Camera();

    this.allScene = [
      new Intro(),
      new Map(),
      new Ladies(),
      new Dam(),
      new Bridge(),
      new Chapel(),
      new Village(),
      new End()
    ];
    this.currentScene = INIT_SCENE;
    this.scene = this.allScene[this.currentScene];
    this.scene.init();

    // Controls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    window.addEventListener("click", this.handleFirstClick);

    this.init();
  }

  async init() {
    await this.load();
  }

  initStats() {
    if (DEV_MODE) {
      this.stats = new Stats();
      this.canvasWrapper.appendChild(this.stats.dom);
    }
  }

  async beforeLoad() {}

  async load() {
    await this.beforeLoad();
    await this.assetsManager.load();

    state.emit(EVENTS.APP_LOADED);
    state.emit(EVENTS.RESIZE, this.viewport.infos);
    state.emit(EVENTS.ATTACH);
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
    if (this.renderer) {
      this.renderer.clear();
      this.renderer.render(this.scene, this.camera);
    }
  }

  onChangeScene(e) {
    this.currentScene = e;
    this.scene.clear();
    this.scene = this.allScene[this.currentScene];
    // console.log(this.scene, this.currentScene);
    this.scene.init();
    this.controls.reset();
  }

  handleFirstClick = () => {
    window.removeEventListener("click", this.handleFirstClick);
    state.emit(EVENTS.FIRST_CLICK);
  };

  clear() {
    WebglController.instance = null;
  }
}
