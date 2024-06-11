import { Howl } from "howler";
import { state } from "../../State";
import data from "./jsons/dialog.json";

const DIALOG_MAX_VOLUME = 0.5;

class DialogManager {
  constructor() {
    state.register(this);
  }

  onFirstClick() {
    this.spritesheet = new Howl({ ...data, volume: DIALOG_MAX_VOLUME });

    this.canPlay = true;
  }
  
  play(dialogId) {
    if (!this.canPlay) return;

    this.spritesheet.play(dialogId);
  }
}

export { DialogManager };
