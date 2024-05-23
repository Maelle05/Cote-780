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
    this.setClearColor(0x988C86, 1);
    this.autoClear = false;

    // this.shadowMap.enabled = true;
	}

  onResize({ width, height, dpr }) {
		this.setSize(width, height);
		this.setPixelRatio(dpr);
	}
}

export { Renderer };