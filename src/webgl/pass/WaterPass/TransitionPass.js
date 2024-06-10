import fs from "./fragment.fs";
import vs from "./vertex.vs";

const WaterPass = {
  uniforms: {
    uTime: { value: 1 },
    uIsWater: { value: false },
    uResolution: { value: null },
    tDiffuse: { value: null },
  },
  vertexShader: vs,
  fragmentShader: fs,
};

export { WaterPass };
