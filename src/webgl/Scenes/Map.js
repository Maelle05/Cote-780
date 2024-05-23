import { Scene } from 'three'
import { state } from '../Utils/State';
import Plan from '../Objects/Plan'
import WebglController from '../WebglController';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Pane } from 'tweakpane';

class Map extends Scene {
	constructor() {
        super()
        state.register(this)

        this.webgl = new WebglController()


        // Controls
        this.controls = new OrbitControls(this.webgl.camera, this.webgl.renderer.domElement);
	}

  init(){
    this.pane = new Pane({ title: 'Parameters Map', expanded: true });
    this.initPane()
  }

  initPane(){
  }

  onAttach(){
      this.plan = new Plan();
      this.add(this.plan);
  }

  clear(){
    this.pane.dispose()
  }
}

export { Map };