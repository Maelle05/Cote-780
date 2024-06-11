import { Howl } from "howler";
import { state } from "../../State";
import { app } from "@/App";

const LAYER_MAX_VOLUME = 0.3;

const LAYERS_SCENES = {
  0: [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  1: [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  2: [0, 0, 0, 0, 0, 0, 0, 0.5, 0, 0, 0],
  3: [0.5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  4: [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
  5: [0, 0, 0, 0.3, 0, 0, 0, 0.4, 0, 0, 0],
  6: [0, 0, 0, 0, 0, 0, 0.5, 0, 1, 0, 0],
  7: [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
};

class LayerManager {
  layers = new Map();
  layersIds = new Map();

  constructor() {
    state.register(this);
  }

  onFirstClick() {
    const audioFiles = import.meta.glob("../../../../public/assets/audio/layers/*.mp3");
    
    Object.values(audioFiles).map((file) => file.name).forEach((path) => {
      const name = path.split("/").pop().split(".")[0].split("_")[0];
      const src = path.split("public")[1];
      this.layers.set(name, new Howl({ src, loop: true, volume: 0 }));
    });

    this.layers.forEach((layer, index) => {
      const id = layer.play();
      this.layersIds.set(index, id);
    });

    this.canPlay = true;

    this.onChangeScene(app.webgl.currentScene);
  }

  onChangeScene(scene) {
    this.playVolumes(LAYERS_SCENES[scene]);
  }

  fadeVolume(howl, howlId, volume, duration = 1000) {
    if (!this.canPlay) return;
    howl.fade(howl.volume(undefined, howl), volume * LAYER_MAX_VOLUME, duration, howlId);
  }

  playVolumes(volumes = []) {
    volumes.forEach((volume, layer) => {
      const idString = (layer + 1).toString();
      const howl = this.layers.get(idString);

      if (!howl || howl.volume(undefined, howl) === volume) return;

      const howlId = this.layersIds.get(idString);

      this.fadeVolume(howl, howlId, volume);
    });
  }
}

export { LayerManager };
