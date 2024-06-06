import { Renderer } from './Renderer';
import { Camera } from './Camera';
import { state } from '../utils/State';
import { INIT_SCENE } from '../utils/constants/config'

// UI
// import { Intro } from "./UI/Intro";
import { Null } from './UI/Null';
import { app } from '@/App';


export default class UIWebglController {
  constructor(container) {
    state.register(this);

    // Core
    this.assetsManager = app.assetsManager;
    this.ticker = app.ticker;

    // Webgl
    this.canvasWrapper = container;
    this.renderer = new Renderer(this.canvasWrapper, 0x000000, 0);
    this.camera = new Camera();

    this.allScene = [new Null()]
    this.currentScene = INIT_SCENE
    if (this.currentScene == 0) {
      this.scene = this.allScene[0]
    } else {
      this.scene = this.allScene[1]
    }
    this.scene.init()
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
    this.scene = this.allScene[0]
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
}
