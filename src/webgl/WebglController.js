import { Renderer } from './Renderer';
import { state } from './Utils/State';
import { AssetsManager } from './Utils/Core/AssetsManager';
import { Ticker } from './Utils/Core/Ticker';
import { Mouse } from './Utils/Tools/Mouse';
import { Scroll } from './Utils/Tools/Scroll';
import { Viewport } from './Utils/Tools/Viewport';
import { Keyboard } from './Utils/Tools/Keyboard';
import { EVENTS } from './Constants/events';
import Stats from 'three/examples/jsm/libs/stats.module';
import { Camera } from './Camera';

// Scenes
import { Map } from "./Scenes/Map";
import { Ladies } from "./Scenes/Ladies";
import { Dam } from "./Scenes/Dam";
import { Bridge } from "./Scenes/Bridge";
import { Chapel } from "./Scenes/Chapel";
import { Village } from "./Scenes/Village";


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
    // Tools
    this.viewport = new Viewport(container);
    this.mouse = new Mouse(this.viewport);
    this.keyboard = new Keyboard();
    this.scroll = new Scroll(this.viewport);

    // Webgl
    this.canvasWrapper = container;
    this.renderer = new Renderer(this.canvasWrapper);
    this.camera = new Camera();

    this.allScene = [new Map(), new Ladies(), new Dam(), new Bridge(), new Chapel(), new Village()]
    this.currentScene = 3

    this.scene = this.allScene[this.currentScene]
    this.scene.init()

    this.init();
  }

  async init() {
    await this.load();
  }

  initStats() {
    this.stats = new Stats();
    this.canvasWrapper.appendChild(this.stats.dom);
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
    if (this.stats) this.stats.update();

    // render
    if (this.renderer) {
      this.renderer.clear();
      this.renderer.render(this.scene, this.camera);
    }
  }

  onChangeScene(){
    this.currentScene = (this.currentScene + 1) % this.allScene.length
    this.scene.clear()
    this.scene = this.allScene[this.currentScene]
    this.scene.init()
  }

  clear() {
    WebglController.instance = null;
  }
}
