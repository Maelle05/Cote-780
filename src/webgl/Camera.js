import { PerspectiveCamera } from 'three';
import { state } from './Utils/State';

class Camera extends PerspectiveCamera {
	constructor() {
        // Base FOV, Viewport Ratio, Cam near, Cam far
        super(70, window.innerWidth / window.innerHeight, 1, 1000);
        state.register(this);

        this.position.set(0, 0, 2);
	}

    onResize({ ratio }) {
		this.aspect = ratio;
		this.fov = 70 / Math.min(1, ratio * 1.5);
		this.updateProjectionMatrix();
	}
}

export { Camera };