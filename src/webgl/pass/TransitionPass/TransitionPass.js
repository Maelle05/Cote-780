import fs from './fragment.fs';
import vs from './vertex.vs';

const TransitionPass = {
	uniforms:{
    uTime: { value: 1. },
    uProgress: { value: 1. },
    uIsColor: { value: true },
    uResolution: { value: null },
    tDiffuse: { value: null },
  },
  vertexShader: vs,
  fragmentShader: fs
}

export { TransitionPass };