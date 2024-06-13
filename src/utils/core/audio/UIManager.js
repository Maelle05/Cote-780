import { Howl } from "howler";
import { state } from "../../State";
import data from "./jsons/ui.json";

const UI_MAX_VOLUME = 0.7;

class UIManager {
  constructor() {
    state.register(this);
  }

  onFirstClick() {
    this.spritesheet = new Howl({ ...data, volume: UI_MAX_VOLUME });

    this.canPlay = true;
  }
  
  play(uiId, volume = 1) {
    if (!this.canPlay) return;

    this.spritesheet.volume(volume * UI_MAX_VOLUME);
    this.spritesheet.play(uiId);
  }
}

export { UIManager };
