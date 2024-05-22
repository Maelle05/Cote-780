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
import { Pane } from 'tweakpane';
import { Camera } from './Camera';

// Scenes
import { Map } from './Scenes/Map';
import { Ladies } from './Scenes/Ladies';

let webglInstance = null;

export default class WebglController {
  constructor(container) {
    // Singleton
    if (webglInstance) {
      return webglInstance;
    }
    webglInstance = this;

    state.register(this);

    // Core
    this.assetsManager = new AssetsManager();
    this.ticker = new Ticker();
    // Tools
    this.viewport = new Viewport(container);
    this.mouse = new Mouse(this.viewport);
    this.keyboard = new Keyboard();
    this.scroll= new Scroll(this.viewport);

    // Settings
    this.pane = new Pane({ title: 'Parameters', expanded: true });

    // Webgl
    this.canvasWrapper = container;
    this.renderer = new Renderer(this.canvasWrapper)
    this.camera = new Camera()

    this.allScene = [Map, Ladies]
    this.currentScene = 0

    this.scene = new this.allScene[this.currentScene]()

    this.init();
  }

  async init() {
    await this.load();
  }

  initStats() {
    this.stats = new Stats();
    this.canvasWrapper.appendChild(this.stats.dom);
  }

  async beforeLoad() {
  }

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
    this.canvasWrapper.innerHTML = '';
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
    if(this.stats) this.stats.update();

    // render
    if(this.renderer){
      this.renderer.clear();
      this.renderer.render(this.scene, this.camera);
      console.log(this.scene);
    }
  }

  onChangeScene(){
    this.currentScene = (this.currentScene + 1) % this.allScene.length
    this.scene = new this.allScene[this.currentScene]()
  }

  clear() {
    // clear pane
    this.pane.dispose();
    webglInstance = null;
  }
}