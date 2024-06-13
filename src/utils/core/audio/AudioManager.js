import { Howl, Howler } from "howler";
import { state } from "../../State";
import SOUNDS_MUSIC from "./jsons/musics.json";
import { LayerManager } from "./LayerManager";
import { DialogManager } from "./DialogManager";
import { UIManager } from "./UIManager";

const MUSIC_VOLUME = 1;

//MUSIC EFFECTS
export const MUSIC_IDS = {
  AMBIENT_UNDERWATER: "ambient_underwater",
  AMBIENT_CHAPEL: "ambient_chapel",
  AMBIENT_END: "ambient_end",
  AMBIENT_LAKE: "ambient_lake",
  AMBIENT_FOREST: "ambient_forest",
};

class AudioManager {
  _musics = new Map();
  canPlay = false;
  currentAmbientName;
  currentAmbientId;
  currentAmbient;

  constructor() {
    state.register(this);

    this.layers = new LayerManager();
    this.dialog = new DialogManager();
    this.ui = new UIManager();
  }

  onFirstClick() {
    Howler.autoSuspend = false;
    Howler.html5PoolSize = 0;
    Howler.usingWebAudio = true;

    Howler.volume(1);

    SOUNDS_MUSIC.sources.forEach((music) => {
      this._musics.set(
        music.name,
        new Howl({
          src: `/assets/audio/musics/${music.src}`,
          loop: true,
          volume: MUSIC_VOLUME,
        })
      );
    });

    this.canPlay = true;

    if (this.queuedAmbientName) {
      this.playMusic(this.queuedAmbientName);
      this.queuedAmbientName = null;
    }
  }

  isPlaying() {
    return Howler.volume() === 1 ? true : false
  }

  setMute(flag) {
    Howler.volume(flag ? 0 : 1);
  }

  fadeVolume(id, soundId, volume, duration = 1000) {
    if (!this.canPlay) return;
    const howl = this._musics.get(id);
    howl.fade(howl.volume(undefined, howl), volume, duration, soundId);
  }

  playMusic(name) {
    if (!this.canPlay) {
      this.queuedAmbientName = name;
      return;
    }
    if (name !== this.currentAmbientName) {
      if (this.currentAmbient) {
        // this.fadeOut(this.currentAmbientName, 1000, this.currentAmbientId);
      }

      this.currentAmbient = this._musics.get(name);
      this.currentAmbientName = name;
      this.currentAmbientId = this.fadeIn(
        this.currentAmbientName,
        MUSIC_VOLUME,
        1000
      );
    }
  }

  pause(id) {
    if (!this.canPlay) return;

    const howl = this._musics.get(id);
    howl.pause();
  }

  stop(id) {
    if (!this.canPlay) return;

    const howl = this._musics.get(id);
    howl.stop();
  }

  fadeIn(id, volume = MUSIC_VOLUME, duration = 1000) {
    if (!this.canPlay) return;

    const howl = this._musics.get(id);
    const soundId = howl.play();

    howl.fade(0, volume, duration, soundId);

    return soundId;
  }

  fadeOut(id, duration = 1000, soundId) {
    if (!this.canPlay) return;

    const howl = this._musics.get(id);

    howl.off("fade", undefined, soundId);
    howl.fade(MUSIC_VOLUME, 0, duration, soundId);

    return new Promise((resolve) => {
      howl.once("fade", resolve, soundId);
    });
  }

  fadeOutStop(id, duration = 1000, soundId) {
    if (!this.canPlay) return;

    this.fadeOut(id, duration, soundId).then(() => this.stop(id));
  }

  fadeOutAmbient() {
    if (!this.canPlay) return;

    this.fadeOutStop(this.currentAmbientName, 1000, this.currentAmbientId);
  }
}

export { AudioManager };
