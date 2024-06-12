import { Howl } from "howler";
import { state } from "../../State";
import data from "./jsons/dialog.json";

const DIALOG_MAX_VOLUME = 1;

class DialogManager {
  currentDialogId = null;
  queuedDialogId = null;
  fading = false;

  constructor() {
    state.register(this);
  }

  onFirstClick() {
    this.spritesheet = new Howl({ ...data, volume: DIALOG_MAX_VOLUME });

    this.canPlay = true;
  }
  
  play(dialogId) {
    if (!this.canPlay) return;

    if (this.currentDialogId) {
      this.queuedDialogId = dialogId;
      if (this.fading) return;
      this.spritesheet.fade(DIALOG_MAX_VOLUME, 0, 500, this.currentDialogId);
      this.fading = true;
      this.spritesheet.once("fade", () => {
        this.fading = false;
        this.currentDialogId = null;
        this.play(this.queuedDialogId);
      });
      return;
    }

    this.currentDialogId = this.spritesheet.play(dialogId);
  }
}

export { DialogManager };
