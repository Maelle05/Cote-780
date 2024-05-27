import { DirectionalLight, AmbientLight, Scene } from "three";
import { state } from "../Utils/State";
import Plan from "../Objects/Plan";
import WebglController from "../WebglController";
import { Pane } from "tweakpane";
import { DEV_MODE } from "../Constants/config";

class Map extends Scene {
  constructor() {
    super();
    state.register(this);

    this.webgl = new WebglController();


    this.ambient = new AmbientLight({ color: 0xFFFFFF, intensity: 0.1})
    this.light = new DirectionalLight({ color: 0x000000, intensity: 1.0 });
    this.light.position.set(0, 10, 0);
    // this.light.castShadow = true;
    // this.light.shadow.mapSize.width = 2048;
    // this.light.shadow.mapSize.height = 2048;

    this.add(this.light, this.ambient);
  }

  init() {
    if (DEV_MODE) {
      this.pane = new Pane({ title: "Parameters Map", expanded: true });
    }
  }

  onAttach() {
    this.plan = new Plan();
    this.plan.position.set(0, 0, -7);
    this.plan.rotation.x = 20
    this.add(this.plan);
  }

  clear() {
    if (DEV_MODE) {
      this.pane.dispose();
    }
  }
}

export { Map };
