import { Group } from 'three';
import { Plane } from './plane';

class ParallaxScene extends Group {
  constructor(name, textures, scale ){
      super()

      this.name = name
      this.planesTexInOrder = textures

      this.planes = []

      this.planesTexInOrder.forEach((texture, i) => {
        const plane = new Plane(i, texture)
        plane.position.z = 0.1 * i
        plane.setScale(scale)

        this.planes.push(plane)
        this.add(plane);
      });


      window.addEventListener('mousemove', this.onMouseMouve)
  }

  onMouseMouve = (e) => {
    const viwport = { x: window.innerWidth, y: window.innerHeight }
    const cursor = { x: e.clientX, y: e.clientY }
    const shift = {
      x: (cursor.x / viwport.x) - 0.5,
      y: (cursor.y / viwport.y) - 0.5
    }
    const strength = 0.2
    
    this.planes.forEach((plane, i) => {
      plane.position.x = - shift.x * i * strength
      plane.position.y = shift.y * i * strength
    })
  }
}

export { ParallaxScene }