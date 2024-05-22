import { Mesh, PlaneGeometry, MeshBasicMaterial, DoubleSide } from 'three';
import { PlanMaterial } from '../Materials/Plan/material';

export default class Plan extends Mesh {
  constructor() {
    super()

    this.geometry = this.#createGeometry();
    this.material = this.#createMaterial();


    this.rotation.x = (180 / Math.PI) / 27

  }

  #createGeometry(){
    const geometry = new PlaneGeometry(3, 3, 60, 60);
    return geometry
  }

  #createMaterial(){
    const material = new PlanMaterial({
            uniforms: {
				uTime: { value: 0 },
			}
    })

    // const material = new MeshBasicMaterial({color: 'red'})
    material.side = DoubleSide
    return material
  }
}