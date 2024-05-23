import { DirectionalLight, Scene } from "three";
import { state } from "../Utils/State";
import Plan from "../Objects/Plan";
import WebglController from "../WebglController";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Pane } from "tweakpane";

class Map extends Scene {
  constructor() {
    super();
    state.register(this);

    this.webgl = new WebglController();

    // Controls
    this.controls = new OrbitControls(
      this.webgl.camera,
      this.webgl.renderer.domElement
    );

    this.light = new DirectionalLight({ color: 0x000000, intensity: 1.0 });
    this.light.position.set(0, 10, 0);
    // this.light.castShadow = true;
    // this.light.shadow.mapSize.width = 2048;
    // this.light.shadow.mapSize.height = 2048;

    this.add(this.light);
  }

  init() {
    this.pane = new Pane({ title: "Parameters Map", expanded: true });
    this.initPane();
  }

  initPane() {}

  onAttach() {
    this.plan = new Plan();
    this.add(this.plan);
  }

  clear() {
    this.pane.dispose();
  }
}

export { Map };
