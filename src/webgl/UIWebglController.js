import { UIRenderer } from './UIRenderer';
import { UICamera } from './UICamera';
import { state } from './Utils/State';
import { EVENTS } from './Constants/events';
import { INIT_SCENE } from './Constants/config'
import WebglController from './WebglController';

// UI
import { Intro } from "./UI/Intro";
import { Null } from './UI/Null';


export default class UIWebglController {
  static instance = null;

  constructor(container) {
    // Singleton
    if (UIWebglController.instance) {
      return UIWebglController.instance;
    }
    UIWebglController.instance = this;

    state.register(this);

    // Core
    this.assetsManager = WebglController.instance.assetsManager;
    this.ticker = WebglController.instance.ticker;

    // Webgl
    this.canvasWrapper = container;
    this.renderer = new UIRenderer(this.canvasWrapper);
    this.camera = new UICamera();

    this.allScene = [new Intro(), new Null()]
    this.currentScene = INIT_SCENE
    this.scene = this.allScene[this.currentScene]
    this.scene.init()

    this.init();
  }

  async init() {
    await this.load();
  }

  async beforeLoad() {}

  async load() {
    await this.beforeLoad();
    await this.assetsManager.load();
  }

  onAttach() {
    // console.log('Event onAttach')
    // clear canvas
    this.canvasWrapper.innerHTML = "";
    this.canvasWrapper.appendChild(this.renderer.domElement);
    this.onRender();
  }

  onChangeScene(e){
    this.currentScene = e
    this.scene.clear()
    if (this.currentScene == 0) {
      this.scene = this.allScene[0]
    } else {
      this.scene = this.allScene[1]
    }
    this.scene.init()
  }

  onRender() {
    // console.log('Event onRender')

    // render
    if (this.renderer) {
      this.renderer.clear();
      this.renderer.render(this.scene, this.camera);
    }
  }

  clear() {
    UIWebglController.instance = null;
  }
}
