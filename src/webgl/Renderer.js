import { WebGLRenderer } from "three";
import { state } from "../utils/State";

class Renderer extends WebGLRenderer {
  constructor(container, color, alpha) {
    super({ antialias: true, powerPreference: "high-performance" });
    state.register(this);

    this.width = container.offsetWidth;
    this.height = container.offsetHeight;

    this.setPixelRatio(window.devicePixelRatio);
    this.setSize(this.width, this.height);
    this.setClearColor(color, alpha);
    this.autoClear = false;

    // this.shadowMap.enabled = true;
  }

  onResize({ width, height, dpr }) {
    this.setSize(width, height);
    this.setPixelRatio(dpr);
  }
}

export { Renderer };
