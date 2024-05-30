import { Scene, MeshMatcapMaterial } from 'three'
import { state } from '../Utils/State';
import WebglController from '../WebglController';
import { Pane } from 'tweakpane';
import { DEV_MODE } from '../Constants/config';
import { CamAnim } from "../Utils/Tools/CamAnim";

class Chapel extends Scene {
	constructor() {
        super()
        state.register(this)

        this.webgl = new WebglController()
	}

  init(){
    if (DEV_MODE) {
      this.pane = new Pane({ title: 'Parameters Chapel', expanded: true });
    }
  }

  onAttach(){
    this.chapel = this.webgl.assetsManager.get('chapel')
    this.chapel.traverse((el) => {
      el.material = new MeshMatcapMaterial({ matcap: this.webgl.assetsManager.get('matcap')})
    })
    this.add(this.chapel)

    this.anim = new CamAnim(5, this.chapel, this.webgl.camera, [0, 0.33, 0.66, 1])
  }

  onChangeSceneStep(){
    this.anim.changeStep()
  }

  clear(){
    if (DEV_MODE) {
      this.pane.dispose()
    }
  }
}

export { Chapel };