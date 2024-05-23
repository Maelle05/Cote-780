import { Scene } from 'three'
import { state } from '../Utils/State';
import TestPlane from '../Objects/TestPlane'
import WebglController from '../WebglController';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Pane } from 'tweakpane';

class Ladies extends Scene {
	constructor() {
        super()
        state.register(this)

        this.webgl = new WebglController()


        // Controls
        this.controls = new OrbitControls(this.webgl.camera, this.webgl.renderer.domElement);
	}

  init(){
    this.pane = new Pane({ title: 'Parameters Ladies', expanded: true });
    this.initPane()
  }

  initPane(){
    this.pane.addBinding(
        {
            progress: 0,
            theme: 'dark',
        },
        'progress', {
            min: 0,
            max: 1,
            step: 0.01,
        }
    ).on('change', function (ev) {
        console.log(`change: ${ev.value}`);
    });
  }

  onAttach(){
      this.plane = new TestPlane();
      this.add(this.plane);
  }

  clear(){
    this.pane.dispose()
  }
}

export { Ladies };