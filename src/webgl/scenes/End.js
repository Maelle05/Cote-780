import { AmbientLight, Scene, Vector3 } from "three";
import { state } from "../../utils/State";
import TestPlane from "../objects/TestPlane";
import { Pane } from "tweakpane";
import { PlaneGeometry } from "three";
import { MeshBasicMaterial } from "three";
import { Mesh } from "three";
import Fireworks from "../objects/Fireworks";
import { DEV_MODE } from "../../utils/constants/config";
import { app } from "@/App";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { CamAnim } from "../utils/CamAnim";

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
    // const controls = new OrbitControls(
    //   app.webgl.camera,
    //   app.webgl.renderer.domElement
    // );
    
    this.end = app.assetsManager.get("end");

    this.ambient = new AmbientLight({ color: 0xffffff, intensity: 0.1 });

    this.add(this.end, this.ambient);

    this.anim = new CamAnim(7, this.end, [0, 0.33, 0.66, 1]);

    this.add(this.fireworks);

    if(app.webgl.currentScene === 7) this.init() 
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
