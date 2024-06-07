import { AmbientLight, FogExp2, Scene } from "three";
import { state } from "../../utils/State";
import { Pane } from "tweakpane";
import { DEV_MODE } from "../../utils/constants/config";
import { app } from "../../App";
import { CamAnim } from "../utils/CamAnim";
import { MeshMatcapMaterial } from "three";

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
    this.scene = app.assetsManager.get('village');

    this.ambient = new AmbientLight({ color: 0xffffff, intensity: 0.1 });

    this.fog = new FogExp2("#0F4185", 0.08);

    this.anim = new CamAnim(
      6,
      this.scene,
      [0, 0.33, 0.66, 1]
    );
    this.add(this.scene, this.ambient);

    if(app.webgl.currentScene === 6) this.init() 
  }

  clear() {
    if (DEV_MODE) {
      this.pane.dispose();
    }
  }
}

export { Village };
