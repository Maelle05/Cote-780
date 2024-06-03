import fs from "./fragment.fs";
import vs from "./vertex.vs";

const TransitionPass = {
  uniforms: {
    uTime: { value: 0 },
    uProgress: { value: 1 },
    uResolution: { value: null },
    tDiffuse: { value: null },
  },
  vertexShader: vs,
  fragmentShader: fs,
};

export { TransitionPass };
