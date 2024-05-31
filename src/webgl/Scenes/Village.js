import { Scene } from "three";
import { state } from "../../utils/State";
import TestPlane from "../objects/TestPlane";
import { Pane } from "tweakpane";
import { DEV_MODE } from "../../utils/constants/config";

class Village extends Scene {
  constructor() {
    super();
    state.register(this);
  }

  init() {
    if (DEV_MODE) {
      this.pane = new Pane({ title: "Parameters Village", expanded: true });
    }
  }

  onAttach() {
    this.plane = new TestPlane();
    this.add(this.plane);
  }

  clear() {
    if (DEV_MODE) {
      this.pane.dispose();
    }
  }
}

export { Village };
