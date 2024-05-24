import { Scene, Mesh, ConeGeometry, MeshBasicMaterial, Group, PlaneGeometry, CanvasTexture, Raycaster } from 'three'
import { state } from '../Utils/State';
import WebglController from '../WebglController';
import { Pane } from 'tweakpane';
import { HeaddressesMaterial } from '../Materials/Headdresses/material';
import { gsap } from 'gsap'

class Demoiselle extends Group {
  constructor(color, height){
    super()
    state.register(this)

    this.webgl = new WebglController()
    this.raycaster = new Raycaster()

    // Canvas texture
    this.color = this.extractRGBParameters(color)
    this.canvas = document.createElement('canvas')
    this.canvas.width = 100
    this.canvas.height = 100
    this.ctx = this.canvas.getContext("2d", { willReadFrequently: true })
    this.ctx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${0.2})`;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.canvasTex = new CanvasTexture(this.canvas);
    // document.querySelector('#vue-app').appendChild(this.canvas)


    this.base = new Mesh(new ConeGeometry( 2, height, 32 ), new MeshBasicMaterial( { color: color } ));
    this.top = new Mesh(new PlaneGeometry( 1, 1, 1, 1 ), new HeaddressesMaterial( {
      uniforms: {
        uTex: { value: this.canvasTex },
      }
    }));
    this.top.name = 'top'
    this.top.position.z = -10;
    this.top.position.y = -0.7;
    this.top.rotateY(160 / (180/Math.PI))
    this.topIsDraw = false

    this.add(this.base, this.top);
  }

  onPointerMove(e){
    if(this.topIsDraw) return

    // update the picking ray with the camera and pointer position
    this.raycaster.setFromCamera(e.webgl, this.webgl.camera);
    
    // calculate objects intersecting the picking ray
    const intersects = this.raycaster.intersectObject( this.top );

    for ( let i = 0; i < intersects.length; i ++ ) {
      // intersects[ i ].object.material.opacity = 1;
      this.drawOnCanvasTex(intersects[ i ].uv)
    }

    if(this.isCanvasPainted()){
      this.ctx.fillStyle = `rgb(${this.color.r}, ${this.color.g}, ${this.color.b})`;
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

      gsap.to(this.top.position, {
        x: 0,
        y: 4,
        z: 0
      })
    }
  }

  drawOnCanvasTex(coords){
    const radius = 20
    const x = coords.x * 100
    const y = coords.y * 100
    const color = `rgb(${this.color.r}, ${this.color.g}, ${this.color.b})`;

    this.ctx.beginPath();
    this.ctx.arc(x, y, radius, 0, 2 * Math.PI);
    this.ctx.fillStyle = color;
    this.ctx.fill();

    // Create a texture from the canvas
    this.canvasTex.needsUpdate = true
  }

  extractRGBParameters(rgbString) {
    const regex = /rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)/;
    const match = rgbString.match(regex);

    // If the string matches the regex, return the parameters as numbers
    if (match) {
        return {
            r: parseInt(match[1], 10),
            g: parseInt(match[2], 10),
            b: parseInt(match[3], 10)
        };
    } else {
        // If no match, return null or throw an error
        return null;
    }
  }

  isCanvasPainted() {
    const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    const data = imageData.data;

    const results = []

    for (let i = 0; i < data.length; i += 4) {
        if (data[i + 3] > 200) {
          results.push(true);
        } else {
          results.push(false);
        }
    }

    const note = results.filter((el) => el == true).length / results.length
  
    if(note > 0.9){
      return true; // Canvas painted
    } else {
      return false;
    }
  }
}


class Ladies extends Scene {
	constructor() {
        super()
        state.register(this)

        this.webgl = new WebglController()
	}

  init(){
    this.pane = new Pane({ title: 'Parameters Ladies', expanded: true });
  }

  onAttach(){
      this.demoiselles = new Group();
      this.D1 = new Demoiselle('rgb(255, 0, 0)', 6);
      this.D1.position.set(-1, 0, 0)
      this.D2 = new Demoiselle('rgb(255, 0, 255)', 5);
      this.D2.position.set(1, -0.5, 0);
      this.demoiselles.add(this.D1, this.D2);
      this.demoiselles.position.set(-6, 0, -12);
      this.demoiselles.rotateY(29)

      this.add(this.demoiselles);
  }

  clear(){
    this.pane.dispose()
  }
}

export { Ladies };