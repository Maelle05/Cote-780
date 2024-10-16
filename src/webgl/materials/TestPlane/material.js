import { ShaderMaterial } from 'three';
import fs from './fragment.fs';
import vs from './vertex.vs';

class TestPlaneMaterial extends ShaderMaterial {
	/**
	 *
	 * @param {import("three").ShaderMaterialParameters} options
	 */
	constructor(options = {}) {
		super(options);

		this.vertexShader = vs;
		this.fragmentShader = fs;
	}
}

export { TestPlaneMaterial };