import { Howl, Howler } from "howler";
import { state } from "../../State";
import SOUNDS_MUSIC from "./musics.json";
// import SOUNDS_UI from './ui-spritesheet.json';
// import SOUNDS_UI from "./ui.json";

const MUSIC_VOLUME = 0.5;
const UI_VOLUME = 0.7;

//MUSIC EFFECTS
export const MUSIC_IDS = {
  MUSIC_1: "music_1",
};

//UI SOUNDS / SOUNDS EFFECTS
export const UI_IDS = {
  NAME: "name",
};

//UI ARRAYS
export const UI_POOL_IDS = {
  READY: ["intro_1", "intro_2", "intro_3"],
};

class AudioManager {
  _musics = new Map();
  _sounds = new Map();
  canPlay = false;
  currentAmbientName;
  currentAmbientId;
  currentAmbient;

  constructor() {
    state.register(this);

    this.frequencies = [];
    this.analyser;
    this.frequencyData;
  }

  onFirstClick() {
    this.audioContext = new window.AudioContext();

    Howler.autoSuspend = false;
    Howler.html5PoolSize = 0;
    Howler.usingWebAudio = true;

    Howler.volume(1);

    // @ts-ignore
    SOUNDS_MUSIC.sources.forEach((music) => {
      this._musics.set(
        music.name,
        new Howl({
          src: `src/assets/audio/musics/${music.src}`,
          loop: true,
          volume: MUSIC_VOLUME,
        })
      );
    });

    // @ts-ignore
    // this._UI = new Howl(SOUNDS_UI);
    // SOUNDS_UI.sources.forEach((sound) => {
    //   this._sounds.set(
    //     sound.name,
    //     new Howl({
    //       src: `src/assets/audio/ui/${sound.src}`,
    //       loop: false,
    //       volume: UI_VOLUME,
    //     })
    //   );
    // });

    this.canPlay = true;
  }

  setMute(flag) {
    Howler.volume(flag ? 0 : 1);
  }

  fadeVolume(id, soundId, volume, duration = 1000) {
    if (!this.canPlay) return;
    const howl = this._musics.get(id);
    howl.fade(howl.volume(undefined, howl), volume, duration, soundId);
  }

  playUI(name, volume = UI_VOLUME) {
    // this._UI.play(name);
    const ui = this._sounds.get(name);

    if (!ui) return;
    ui.volume(volume);
    ui.play();
    return ui;
  }

  playUiRandom(names, random = null) {
    if (random === null) {
      const random = Math.floor(Math.random() * names.length);
      const ui = this._sounds.get(names[random]);
      if (!ui) return;
      ui.play();
      // this._UI.play(names[random]);
    } else {
      const ui = this._sounds.get(names[random]);
      if (!ui) return;
      ui.play();
      // this._UI.play(names[random]);
    }
  }

  getUiRandom(names) {
    const random = Math.floor(Math.random() * names.length);
    const ui = this._sounds.get(names[random]);
    // randomSoundDuration: Object.values(this._UI._sprite)[random][1]

    return { randomSoundDuration: ui._duration * 1000, random: random };
  }

  getDuration(name) {
    const ui = this._sounds.get(name);
    return ui._duration * 1000;
  }

  playMusic(name) {
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

      // this.initFrequencies(name);
    }
  }

  initFrequencies(id) {
    const howl = this._musics.get(id);
    const audioContext = howl._sounds[0]._node.context;

    // Créer un nœud d'analyseur audio
    this.analyser = audioContext.createAnalyser();
    this.analyser.fftSize = 2048; // Taille de la fenêtre FFT (doit être une puissance de 2)
    this.analyser.minDecibels = -90; // Niveau minimal en décibels
    this.analyser.maxDecibels = -10; // Niveau maximal en décibels
    this.analyser.smoothingTimeConstant = 0.85; // Constante de lissage (entre 0 et 1)

    const howlNode = Howler.masterGain;
    howlNode.connect(this.analyser);

    this.frequencyData = new Uint8Array(this.analyser.frequencyBinCount);
  }

  onRender() {
    if (!this.analyser) return;
    this.analyser.getByteFrequencyData(this.frequencyData);
    const frequencyStep = Math.floor(this.frequencyData.length / 7);

    for (let i = 0; i < 6; i++) {
      const frequency = this.frequencyData.slice(
        frequencyStep * i,
        frequencyStep * (i + 1)
      );
      this.frequencies[i] = this.calculateAverageVolume(frequency);
    }
  }

  calculateAverageVolume(frequencyData) {
    let sum = 0;
    for (let i = 0; i < frequencyData.length; i++) {
      sum += frequencyData[i];
    }
    const average = sum / frequencyData.length;
    return average;
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
}

export { AudioManager };
