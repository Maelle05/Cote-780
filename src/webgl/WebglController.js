import { Renderer } from "./Renderer";
import { state } from "../utils/State";
import { DEV_MODE, INIT_SCENE } from "../utils/constants/config";
import Stats from "three/examples/jsm/libs/stats.module";
import { Camera } from "./Camera";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

// Scenes
import { Intro } from "./scenes/Intro";
import { Map } from "./scenes/Map";
import { Ladies } from "./scenes/Ladies";
import { Bridge } from "./scenes/Bridge";
import { Dam } from "./scenes/Dam";
import { Chapel } from "./scenes/Chapel";
import { Village } from "./scenes/Village";
import { End } from "./scenes/End";

export default class WebglController {
  constructor(container) {
    state.register(this);

    // Webgl
    this.canvasWrapper = container;
    this.renderer = new Renderer(this.canvasWrapper, 0x988c86, 1);
    this.camera = new Camera();

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
    if (this.renderer) {
      this.renderer.clear();
      this.renderer.render(this.scene, this.camera);
    }
  }

  onChangeScene(e) {
    this.currentScene = e;
    this.camera = new Camera();
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enabled = true;
    this.controls.reset();
    this.scene.clear();
    this.scene = this.allScene[this.currentScene];
    this.scene.init();
  }
}
