import { app } from "@/App.js";
import { SpritesheetMaterial } from "../materials/Spritesheet/SpritesheetMaterial.js";
import { state } from "@/utils/State.js";
import { EVENTS } from "@/utils/constants/events.js";

class SpritesheetPlayer {
  material;
  frameRate = 24;
  playing = false;
  time = 0;
  loop = false;
  //   onStarted = new Signal<void>();
  //   onEnded = new Signal<void>();

  constructor(textureID) {
    state.register(this);

    this.textureID = textureID;
    this.material = new SpritesheetMaterial(
      app.assetsManager.get(this.textureID),
      app.assetsManager.get(this.textureID + "_data")
    );
    // this.play();
  }

  play() {
    if (this.playing) return;

    this.playing = true;
  }

  stop() {
    this.reset();

    state.emit(EVENTS.FIREWORKS_ANIM_STOP, this.textureID);

    if (this.loop) {
      this.play();
    }
  }

  reset() {
    this.playing = false;
    this.time = 0;
  }

  onTick({ dt }) {
    if (!this.playing) return;
    if (!this.material) return;

    const currentFrame = Math.floor(this.time * this.frameRate);

    if (currentFrame >= this.material.length) {
      this.stop();
      return;
    }

    this.material.currentFrame = currentFrame;
    this.time += dt;
  }
}

export { SpritesheetPlayer };
// import { Color, Texture, Vector3 } from "three";
// import { Pane } from "tweakpane";

// import { Time } from "../../engine/core/Time";
// import { Signal } from "../../engine/core/Signal";
// import { SpritesheetData, SpritesheetMaterial } from "../../materials/vfx/spritesheet/SpritesheetMaterial";
// import { Component } from "../../engine/ecs/Component";
// import { Renderable } from "./Renderable";

// export class SpritesheetPlayer extends Component {
//   material?: SpritesheetMaterial;
//   frameRate = 24;
//   playing = false;
//   time = 0;
//   autoplay = true;
//   once = true;
//   loop = false;
//   frameShift = 0;
//   exitAnimation = false;
//   onStarted = new Signal<void>();
//   onEnded = new Signal<void>();

//   init() {
//     super.init();

//     const renderable = this.entity.getComponent(Renderable) as Renderable;

//     if (!renderable) {
//       throw new Error("SpritesheetPlayer requires a Renderable component");
//     }

//     const { mesh } = renderable;

//     if (!mesh?.isMesh) {
//       throw new Error("SpritesheetPlayer couldn't find a mesh in the renderable hierarchy");
//     }

//     this.frameRate = this.args.frameRate as number || this.frameRate;
//     this.once = this.args.once !== undefined ? this.args.once as boolean : this.once;
//     this.loop = this.args.loop !== undefined ? this.args.loop as boolean : this.loop;
//     this.exitAnimation = this.args.exitAnimation !== undefined ? this.args.exitAnimation as boolean : this.exitAnimation;
//     this.frameShift = this.args.frameShift as number || 0;
//     this.material = new SpritesheetMaterial({
//       spritesheet: this.args.map as Texture,
//       data: this.args.data as SpritesheetData,
//       tint: this.args.tint as Color
//     });
//     mesh.material = this.material;

//     this.entity.visible = false;

//     const autoplay = this.args.autoplay !== undefined ? this.args.autoplay : this.autoplay;

//     if (autoplay) {
//       this.play();
//     }
//   }

//   reset() {
//     this.playing = false;
//     this.time = 0;
//     if (!this.exitAnimation) this.entity.visible = false;

//     return this;
//   }

//   setFrame(frame: number) {
//     if (!this.material) return;
//     this.material.currentFrame = frame;
//   }

//   play(position?: Vector3, size?: number) {
//     if (this.playing) return;

//     this.entity.visible = true;

//     if (position) {
//       this.entity.transform.position.copy(position);
//     }

//     if (size) {
//       this.entity.transform.scale.setScalar(size);
//     }

//     this.playing = true;
//     this.onStarted.emit();
//   }

//   update(time: Time) {
//     if (!this.playing) return;
//     if (!this.material) return;

//     const currentFrame = Math.floor(this.time * this.frameRate) + this.frameShift;

//     if (currentFrame >= this.material.length) {
//       this.stop();
//       return;
//     }

//     this.material.currentFrame = currentFrame;
//     this.time += time.delta;
//   }

//   stop() {
//     // TODO: dispose entity instead of resetting it

//     this.reset();

//     // if (this.once) {
//     //   this.entity.reset();
//     // } else {
//     //   this.reset();
//     // }

//     this.onEnded.emit();

//     if (this.loop) {
//       this.play();
//     }
//   }

//   onGUI(pane: Pane) {
//     const folder = pane.addFolder({
//       title: "Spritesheet Player"
//     });

//     const params = {
//       position: new Vector3(0, 0, 0),
//       scale: 1,
//     };

//     folder.addButton({ title: 'Play' }).on('click', () => { this.play(params.position, params.scale) });

//     folder.addInput(this, 'frameRate', {
//       min: 0,
//       max: 60,
//     });

//     folder.addInput(params, 'position', {
//       x: { min: -2, max: 2 },
//       y: { min: -2, max: 2 },
//       z: { min: -2, max: 2 },
//     });

//     folder.addInput(params, 'scale', {
//       min: 0,
//       max: 2,
//     });
//   }
// }
