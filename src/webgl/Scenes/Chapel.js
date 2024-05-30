import { Scene, MeshMatcapMaterial } from 'three'
import { state } from '../../utils/State';
import { Pane } from 'tweakpane';
import { DEV_MODE } from '../../utils/constants/config';
import { CamAnim } from "../../utils/tools/CamAnim";
import { app } from '@/App';

class Chapel extends Scene {
	constructor() {
    super()
    state.register(this)
	}

  init(){
    if (DEV_MODE) {
      this.pane = new Pane({ title: 'Parameters Chapel', expanded: true });
    }
  }

  onAttach(){
    this.chapel = app.assetsManager.get('chapel')
    this.chapel.traverse((el) => {
      el.material = new MeshMatcapMaterial({ matcap: app.assetsManager.get('matcap')})
    })
    this.add(this.chapel)

    this.anim = new CamAnim(5, this.chapel, app.webgl.camera, [0, 0.33, 0.66, 1])
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