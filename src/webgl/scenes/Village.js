import { Scene } from "three";
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
    this.scene.traverse((el) => {
      el.material = new MeshMatcapMaterial({ matcap: app.assetsManager.get('matcap')})
    })

    this.anim = new CamAnim(
      6,
      this.scene,
      [0, 0.33, 0.66, 1]
    );
    this.add(this.scene);
  }

  clear() {
    if (DEV_MODE) {
      this.pane.dispose();
    }
  }
}

export { Village };
