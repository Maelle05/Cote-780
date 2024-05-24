import { Scene } from 'three'
import { state } from '../Utils/State';
import TestPlane from '../Objects/TestPlane'
import IntroText from '../Objects/UI/IntroText'
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
  }

  onAttach(){
    this.text = new IntroText();
    this.add(this.text);
  }

  onIntroUpdateText(e) {
    if (this.text === undefined) return;
    this.text.updateText(e.text)
  }

  clear(){
    this.pane.dispose()
    this.text.dispose()
  }
}

export { Intro };