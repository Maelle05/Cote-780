import { app } from "../../App";
import dataText from "../../locales/fr.json";
import { state } from "../State";
import { INIT_SCENE } from "../../utils/constants/config";
import { EVENTS } from "../constants/events";

let instance = null;
export default class HandleScenes {
  constructor() {
    if (instance) {
      return instance;
    }
    instance = this;

    state.register(this);
  }

  onAttach() {
    this.webgl = app.webgl;
    this.uiwebgl = app.uiWebgl;
    this.scenes = this.webgl.allScene;

    this.currentScene = INIT_SCENE;
    this.currentStepCam = 0;
    this.nbStepsCam = null;

    this.currentStepCamTexts = null;
    this.currentText = null;
    this.currentStepText = 0;
    this.nbStepsText = null;

    // 0 - Intro, 1 - Tuto, 2 - Interactions, 3 - Conclusion
    this.sceneStatus = 0;

    // Text
    this.textArray = [];
    // 0 - Ladies, 1 - Dam, 2 - Bridge, 3 - Chapel, 4 - Village, 5 - End
    for (let i = 0; i < this.scenes.length; i++) {
      this.textArray.push(dataText["scene_" + i]);
    }

    if (this.webgl.scene.anim)
      this.nbStepsCam = this.webgl.scene.anim.keyframes.length;

    this.initCurrentText();
  }

  initCurrentText() {
    this.currentStepCamTexts = this.getCurrentStepTexts();
    this.nbStepsText = this.currentStepCamTexts.length;
    this.currentText = this.getCurrentText();
    state.emit(EVENTS.UPDATE_DIALOGUE, this.currentText);
  }

  onGoNext() {
    switch (this.currentScene) {
      case 0:
        this.currentScene = 1;
        state.emit(EVENTS.CHANGE_SCENE, 1);
        break;

      case 1:
        this.currentScene = 2;
        state.emit(EVENTS.ASK_CHANGE_SCENE, 2);
        break;

      default:
        this.currentStepText = this.currentStepText + 1;
        if (this.currentStepText < this.nbStepsText) {
          this.currentText = this.getCurrentText();
          state.emit(EVENTS.UPDATE_DIALOGUE, this.currentText);
        } else {
          this.currentStepCam = this.currentStepCam + 1;
          if (this.currentStepCam < this.nbStepsCam) {
            state.emit(EVENTS.CHANGE_SCENE_STEP);
            this.currentStepText = 0;
            this.initCurrentText();
          } else {
            this.currentStepCam = 0;
            this.currentStepText = 0;
            this.currentScene = (this.currentScene + 1) % this.scenes.length;
            state.emit(EVENTS.ASK_CHANGE_SCENE, this.currentScene);
            this.initCurrentText();
          }
        }
        break;
    }
  }

  onGoPrev() {
    this.currentStepCam = 0;
    this.currentStepText = 0;
    this.currentScene = (this.currentScene - 1) % this.scenes.length;
    state.emit(EVENTS.CHANGE_SCENE, this.currentScene);
    this.initCurrentText();
  }

  onChangeScene(e) {
    this.currentScene = e;
    // console.log('Id scene : ' + e + ', step cam : ' + this.currentStepCam);
    if (this.webgl.scene.anim)
      this.nbStepsCam = this.webgl.scene.anim.keyframes.length;
    if (e != 1) this.initCurrentText();
  }

  onChangeSceneStep() {
    this.currentStepCam =
      (this.webgl.scene.anim.currentKeyfame + 1) % this.nbStepsCam;
    // console.log('Id scene : ' + this.currentScene + ', step cam : ' + this.currentStepCam);
  }

  getCurrentStepTexts() {
    const currentSceneTexts = Object.values(this.textArray[this.currentScene]);
    let result = currentSceneTexts.filter(
      (el) => el.camera == this.currentStepCam
    );
    this.nbStepsText = result.length;
    return result;
  }

  getCurrentText() {
    const result = this.currentStepCamTexts[this.currentStepText];
    return result;
  }

  getCurrentScene() {
    return this.currentScene;
  }

  getCurrentSceneStep() {
    return this.currentStepCam;
  }
}
