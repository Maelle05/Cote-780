import { PerspectiveCamera } from "three";
import { state } from "../utils/State";

class Camera extends PerspectiveCamera {
  constructor() {
    // Base FOV, Viewport Ratio, Cam near, Cam far
    super(70, window.innerWidth / window.innerHeight, 0.1, 1000);
    state.register(this);

    this.position.set(0, 0, 2);

    this.userData.name = 'Camera Base'
  }

  onResize({ ratio }) {
    this.aspect = ratio;
    this.fov = 70 / Math.min(1, ratio * 1.5);
    this.updateProjectionMatrix();
  }
}

export { Camera };
