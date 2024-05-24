import { Scene, MeshMatcapMaterial } from 'three'
import { state } from '../Utils/State';
import WebglController from '../WebglController';
import { Pane } from 'tweakpane';

class Dam extends Scene {
	constructor() {
        super()
        state.register(this)

        this.webgl = new WebglController()

        this.PARAMS = {
          scenePos: {
            x: -3.2,
            y: -2.5,
            z: -5.7,
          },
          sceneRot: {
            x: 0,
            y: 0,
            z: 0,
          }
        }
	}

  init(){
    this.pane = new Pane({ title: 'Parameters Dam', expanded: true });
    this.pane.addBinding(this.PARAMS, 'sceneRot', {
      min: -180,
      max: 180,
      step: 0.1
    }).on('change', (ev) => {
      this.scene.rotation.set(ev.value.x / (180 / Math.PI), ev.value.y / (180 / Math.PI), ev.value.z / (180 / Math.PI))
    });
    this.pane.addBinding(this.PARAMS, 'scenePos', {
      min: -10,
      max: 10,
      step: 0.1
    }).on('change', (ev) => {
      console.log(ev.value);
      this.scene.position.set(ev.value.x, ev.value.y, ev.value.z)
    });
  }

  onAttach(){
      this.scene = this.webgl.assetsManager.get('dam');
      this.scene.position.set(this.PARAMS.scenePos.x, this.PARAMS.scenePos.y, this.PARAMS.scenePos.z)

      this.scene.traverse((el) => {
        el.material = new MeshMatcapMaterial({ matcap: this.webgl.assetsManager.get('matcap')})
      })
      this.add(this.scene);
  }

  clear(){
    this.pane.dispose()
  }
}

export { Dam };