import { Scene } from 'three'
import { state } from '../Utils/State';
import TestPlane from '../Objects/TestPlane'
import WebglController from '../WebglController';
import { Pane } from 'tweakpane';
import { DEV_MODE } from '../Constants/config';

class Village extends Scene {
	constructor() {
        super()
        state.register(this)

        this.webgl = new WebglController()
	}

  init(){
    if (DEV_MODE) {
      this.pane = new Pane({ title: 'Parameters Village', expanded: true });
    }
  }

  onAttach(){
      this.plane = new TestPlane();
      this.add(this.plane);
  }

  clear(){
    if (DEV_MODE) {
      this.pane.dispose()
    }
  }
}

export { Village };