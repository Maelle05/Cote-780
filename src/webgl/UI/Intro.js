import { Scene } from 'three'
import { state } from '../Utils/State';
import TestPlane from '../Objects/TestPlane'
import UiWebglController from '../UIWebglController';
import { Pane } from 'tweakpane';

class Intro extends Scene {
	constructor() {
        super()
        state.register(this)

        this.webgl = new UiWebglController()
	}

  init(){
    this.pane = new Pane({ title: 'Parameters Intro', expanded: true });
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

export { Intro };