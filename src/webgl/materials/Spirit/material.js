import { ShaderMaterial } from "three";
import fs from "./fragment.fs";
import vs from "./vertex.vs";

class SpiritMaterial extends ShaderMaterial {
  /**
   *
   * @param {import("three").ShaderMaterialParameters} options
   */
  constructor(options = {}) {
    super(options);

    this.vertexShader = vs;
    this.fragmentShader = fs;

    this.transparent = true;
  }
}

export { SpiritMaterial };
