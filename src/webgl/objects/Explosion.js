import { Mesh, PlaneGeometry, MeshBasicMaterial, DoubleSide } from "three";
import { TestPlaneMaterial } from "../materials/TestPlane/material";
import { BufferGeometry } from "three";
import { Float32BufferAttribute } from "three";
import { PointsMaterial } from "three";
import { Points } from "three";
import { FireworkMaterial } from "../materials/Firework/material";
import { Uniform } from "three";
import { Vector2 } from "three";
import { app } from "@/App";
import { state } from "@/utils/State";

export default class Explosion extends Mesh {
  constructor({ spritesheet, data }) {
    super();
    state.register(this);

    console.log(data);

    const { w: width, h: height } = data.meta.size;
    const [framesOrder] = Object.values(data.animations);
    const { frames } = data;

    this.spritesheet = this.spritesheet;
    this.spritesheetWidth = width;
    this.spritesheetHeight = height;
    this.framesOrder = framesOrder;
    this.frames = frames;
    this.length = framesOrder.length;
    this.currentFrame = 0;
    this.frameSize = frames[framesOrder[0]].sourceSize;

    this.resolution = new Vector2(app.viewport.width, app.viewport.height);

    this.geometry = this.#createGeometry();
    this.material = this.#createMaterial();
  }

  #createGeometry() {
    const geometry = new PlaneGeometry(1, 1, 1, 1);

    return geometry;
  }

  #createMaterial() {
    // Material
    // const material = new ExplosionMaterial({
    //   uniforms: {
    //     tSpritesheet: { value: this.spritesheet },
    //     uOffset: { value: new Vector2() },
    //     uSize: {
    //       value: new Vector2(
    //         this.frameSize.frameWidth / this.spritesheetWidth,
    //         this.frameSize.frameHeight / this.spritesheetHeight
    //       ),
    //     },
    //     uScale: { value: new Vector2() },
    //     uPosition: { value: new Vector2() },
    //   },
    //   transparent: true,
    // });
    const material = new MeshBasicMaterial({ color: 0xff0000 });

    return material;
  }

  tick() {
    return;
    const sprite = this.frames[this.framesOrder[this.currentFrame]];
    this.material.uniforms.uOffset.value.x =
      sprite.frame.x / this.spritesheetWidth;
    this.material.uniforms.uOffset.value.y =
      1 -
      sprite.frame.y / this.spritesheetHeight -
      sprite.frame.h / this.spritesheetHeight;
    this.material.uniforms.uSize.value.x =
      sprite.frame.w / this.spritesheetWidth;
    this.material.uniforms.uSize.value.y =
      sprite.frame.h / this.spritesheetHeight;
    this.material.uniforms.uScale.value.x =
      sprite.frame.w / sprite.sourceSize.w;
    this.material.uniforms.uScale.value.y =
      sprite.frame.h / sprite.sourceSize.h;
    this.material.uniforms.uPosition.value.x =
      (sprite.spriteSourceSize.x +
        sprite.spriteSourceSize.w / 2 -
        sprite.sourceSize.w / 2) /
      sprite.sourceSize.w;
    this.material.uniforms.uPosition.value.y =
      -(
        sprite.spriteSourceSize.y +
        sprite.spriteSourceSize.h / 2 -
        sprite.sourceSize.h / 2
      ) / sprite.sourceSize.h;
  }

  resize() {
    this.resolution.set(
      app.viewport.width * Math.min(window.devicePixelRatio, 2),
      app.viewport.height * Math.min(window.devicePixelRatio, 2)
    );
  }
}
