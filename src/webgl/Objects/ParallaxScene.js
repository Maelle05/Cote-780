import { Group } from 'three';
import { Plane } from './plane';
import { Perso } from './Perso';

class ParallaxScene extends Group {
  constructor(name, textures, scale, persoText){
      super()

      this.name = name
      this.planesTexInOrder = textures

      // Planes
      this.planes = []
      this.planesTexInOrder.forEach((texture, i) => {
        const plane = new Plane(i, texture)
        plane.position.z = 0.05 * i
        plane.setScale(scale)

        this.planes.push(plane)
        this.add(plane);
      });

      // Perso
      this.perso = new Perso(persoText)
      this.perso.setScale(0.2)
      this.persoBasePos = {
        x: -3.5,
        y: -0.25,
        z: 0.25,
      }
      this.perso.position.z = this.persoBasePos.z
      this.perso.position.x = this.persoBasePos.x
      this.perso.position.y = this.persoBasePos.y
      this.add(this.perso)


      window.addEventListener('mousemove', this.onMouseMouve)
      window.addEventListener('click', this.onMouseClick)
  }

  onMouseMouve = (e) => {
    const viwport = { x: window.innerWidth, y: window.innerHeight }
    const cursor = { x: e.clientX, y: e.clientY }
    this.shift = {
      x: (cursor.x / viwport.x) - 0.5,
      y: (cursor.y / viwport.y) - 0.5
    }
    this.strength = 0.05
    
    this.planes.forEach((plane, i) => {
      plane.position.x = - this.shift.x * i * this.strength
      plane.position.y = this.shift.y * i * this.strength

      if (plane.name = 'plane-5') {
        this.perso.position.x = this.persoBasePos.x - this.shift.x * i * this.strength
        this.perso.position.y = this.persoBasePos.y + this.shift.y * i * this.strength
      }
    })
  }

  onMouseClick = () => {
    this.persoBasePos.x += 0.1

    this.perso.position.x = this.persoBasePos.x - this.shift.x * 5 * this.strength
    this.perso.position.y = this.persoBasePos.y + this.shift.y * 5 * this.strength
  }
}

export { ParallaxScene }