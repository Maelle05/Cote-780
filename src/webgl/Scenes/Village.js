import { Scene } from 'three'
import { state } from '../Utils/State';
import TestPlane from '../Objects/TestPlane'
import WebglController from '../WebglController';
import { Pane } from 'tweakpane';

class Village extends Scene {
	constructor() {
        super()
        state.register(this)

        this.webgl = new WebglController()
	}

  init(){
    this.pane = new Pane({ title: 'Parameters Village', expanded: true });
    this.initPane()
  }

  initPane(){
  }

  onAttach(){
      this.plane = new TestPlane();
      this.add(this.plane);
  }

  clear(){
    this.pane.dispose()
  }
}

export { Village };