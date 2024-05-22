import { WebGLRenderer } from 'three';
import { state } from './Utils/State';

class Renderer extends WebGLRenderer {
	constructor(container) {
    super({ antialias: true, powerPreference: 'high-performance' });
    state.register(this);

    this.width = container.offsetWidth;
    this.height = container.offsetHeight;

    this.setPixelRatio(window.devicePixelRatio);
    this.setSize(this.width, this.height);
    this.setClearColor(0x000000, 1);
    this.autoClear = false;
	}

  onResize({ width, height, dpr }) {
		this.setSize(width, height);
		this.setPixelRatio(dpr);
	}
}

export { Renderer };