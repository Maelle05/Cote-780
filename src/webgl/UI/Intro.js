import { DEV_MODE, INTRO_SECTIONS } from '@/utils/constants/config';
import { Scene } from 'three';
import { state } from '../../utils/State';
import TestPlane from '../objects/TestPlane'
import IntroText from '../objects/UI/IntroText'
import { Pane } from 'tweakpane';

class Intro extends Scene {
  constructor() {
    super()
    state.register(this)
  }

  init(){
    if (DEV_MODE) {
      this.pane = new Pane({ title: 'Parameters Intro', expanded: true });
    }
  }

  onAttach(){
    this.text = new IntroText();
    this.text.setText(INTRO_SECTIONS[0].text);
    this.add(this.text);
  }

  onIntroUpdateText(e) {
    if (this.text === undefined) return;
    this.text.animateText(e.text);
  }

  clear(){
    if (DEV_MODE) {
      this.pane.dispose()
    }
    this.text.dispose()
  }
}

export { Intro };