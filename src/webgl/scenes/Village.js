import { AmbientLight, FogExp2, Scene } from "three";
import { state } from "../../utils/State";
import { Pane } from "tweakpane";
import { DEV_MODE } from "../../utils/constants/config";
import { app } from "../../App";
import { CamAnim } from "../utils/CamAnim";
import { MeshMatcapMaterial } from "three";
import GodRays from "../objects/GodRays";
import { Group } from "three";

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

    this.godRays = new Group();
    this.godRay1 = new GodRays();
    this.godRay1.position.set(-9, 1.7, 6)
    this.godRay2 = new GodRays()
    this.godRay2.position.set(-2, 1.8, 0.5)
    this.godRay3 = new GodRays()
    this.godRay3.position.set(8.5, 1.8, -2.8)
    this.godRay4 = new GodRays()
    this.godRay4.position.set(14, 1.8, -6.5)
    this.godRay4.material.uniforms.g_alpha.value = 0.5
    this.godRays.add(this.godRay1, this.godRay2, this.godRay3, this.godRay4)

    this.anim = new CamAnim(
      6,
      this.scene,
      [0, 0.33, 0.66, 1]
    );


    this.add(this.scene, this.ambient, this.godRays);

    if(app.webgl.currentScene === 6) this.init() 
  }

  onTick(){
  }

  clear() {
    if (DEV_MODE) {
      this.pane.dispose();
    }
  }
}

export { Village };
