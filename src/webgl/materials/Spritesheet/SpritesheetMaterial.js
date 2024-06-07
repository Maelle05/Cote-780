import { ShaderMaterial, Vector2 } from "three";
import fs from "./fragment.fs";
import vs from "./vertex.vs";
import { app } from "@/App";
import { state } from "@/utils/State";

export class SpritesheetMaterial extends ShaderMaterial {
  constructor(spritesheet, data) {
    const { w: width, h: height } = data.meta.size;
    const [framesOrder] = Object.values(data.animations);
    const { frames } = data;
    const { w: frameWidth, h: frameHeight } = frames[framesOrder[0]].sourceSize;

    super({
      uniforms: {
        tSpritesheet: { value: spritesheet },
        uOffset: { value: new Vector2() },
        uSize: { value: new Vector2(frameWidth / width, frameHeight / height) },
        uScale: { value: new Vector2() },
        uPosition: { value: new Vector2() },
      },
      vertexShader: vs.toString(),
      fragmentShader: fs.toString(),
    });

    this.transparent = true;
    this.spritesheetWidth = width;
    this.spritesheetHeight = height;
    this.framesOrder = framesOrder;
    this.frames = frames;
    this.length = framesOrder.length;
    this.currentFrame = 0;

    state.register(this);
  }

  onRender() {
    const sprite = this.frames[this.framesOrder[this.currentFrame]];
    this.uniforms.uOffset.value.x = sprite.frame.x / this.spritesheetWidth;
    this.uniforms.uOffset.value.y =
      1 -
      sprite.frame.y / this.spritesheetHeight -
      sprite.frame.h / this.spritesheetHeight;
    this.uniforms.uSize.value.x = sprite.frame.w / this.spritesheetWidth;
    this.uniforms.uSize.value.y = sprite.frame.h / this.spritesheetHeight;
    this.uniforms.uScale.value.x = sprite.frame.w / sprite.sourceSize.w;
    this.uniforms.uScale.value.y = sprite.frame.h / sprite.sourceSize.h;
    this.uniforms.uPosition.value.x =
      (sprite.spriteSourceSize.x +
        sprite.spriteSourceSize.w / 2 -
        sprite.sourceSize.w / 2) /
      sprite.sourceSize.w;
    this.uniforms.uPosition.value.y =
      -(
        sprite.spriteSourceSize.y +
        sprite.spriteSourceSize.h / 2 -
        sprite.sourceSize.h / 2
      ) / sprite.sourceSize.h;
  }
}
