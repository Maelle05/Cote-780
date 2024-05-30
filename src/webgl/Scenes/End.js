import { Scene, Vector3 } from "three";
import { state } from "../../utils/State";
import TestPlane from "../objects/TestPlane";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Pane } from "tweakpane";
import { PlaneGeometry } from "three";
import { MeshBasicMaterial } from "three";
import { Mesh } from "three";
import Fireworks from "../objects/Fireworks";
import { DEV_MODE } from "../../utils/constants/config";

class End extends Scene {
  constructor() {
    super();
    state.register(this);

    this.fireworks = new Fireworks(100, new Vector3(), 0.05);
  }

  init() {
    if (DEV_MODE) {
      this.pane = new Pane({ title: "Parameters End", expanded: true });
    }
  }

  onAttach() {
    this.add(this.fireworks);
  }

  clear() {
    if (DEV_MODE) {
      this.pane.dispose();
    }
  }

  onResize() {
    this.fireworks.resize();
  }
}

export { End };
