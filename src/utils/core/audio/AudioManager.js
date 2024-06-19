import { Howl, Howler } from "howler";
import { state } from "../../State";
import SOUNDS_MUSIC from "./jsons/musics.json";
import { LayerManager } from "./LayerManager";
import { DialogManager } from "./DialogManager";
import { UIManager } from "./UIManager";

const AMBIENT_VOLUME = 1;
const MUSIC_VOLUME = 0.3;

//MUSIC EFFECTS
export const AMBIENT_IDS = {
  AMBIENT_LADIES: "ambient_ladies",
  AMBIENT_DAM: "ambient_dam",
  AMBIENT_BRIDGE: "ambient_bridge",
  AMBIENT_CHAPEL: "ambient_chapel",
  AMBIENT_UNDERWATER: "ambient_underwater",
  AMBIENT_END: "ambient_end",
};

export const MUSIC_IDS = {
  CLASSIC_LOOP: "classic_loop",
  VILLAGE_LOOP: "village_loop",
  END_LOOP: "end_loop",
};

class AudioManager {
  _musics = new Map();
  canPlay = false;

  currentAmbientName;
  currentAmbientId;
  currentAmbient;

  currentMusicName;
  currentMusicId;
  currentMusic;

  constructor() {
    state.register(this);

    // this.layers = new LayerManager();
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
      this.playAmbient(this.queuedAmbientName);
      this.queuedAmbientName = null;
    } else {
      this.playAmbient(AMBIENT_IDS.AMBIENT_LADIES);
    }

    if (this.queuedMusicName) {
      this.playMusic(this.queuedMusicName);
      this.queuedMusicName = null;
    } else {
      this.playMusic(MUSIC_IDS.CLASSIC_LOOP);
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

  playAmbient(name) {
    if (!this.canPlay) {
      this.queuedAmbientName = name;
      return;
    }
    if (name !== this.currentAmbientName) {
      this.currentAmbient = this._musics.get(name);
      this.currentAmbientName = name;
      this.currentAmbientId = this.fadeIn(
        this.currentAmbientName,
        AMBIENT_VOLUME,
        1000
      );
    }
  }

  playMusic(name) {
    if (!this.canPlay) {
      this.queuedMusicName = name;
      return;
    }
    if (name !== this.currentMusicName) {
      this.currentMusic = this._musics.get(name);
      this.currentMusicName = name;
      this.currentMusicId = this.fadeIn(
        this.currentMusicName,
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

  fadeOutMusic() {
    if (!this.canPlay) return;

    this.fadeOutStop(this.currentMusicName, 1000, this.currentMusicId);
  }
}

export { AudioManager };
