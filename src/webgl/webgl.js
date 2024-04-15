import { Scene, BoxGeometry, MeshBasicMaterial, Mesh, PerspectiveCamera, WebGLRenderer } from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export class webgl {
  constructor(webglCanvas) {

    this.canvas = webglCanvas

    /*
     * Initialisation
     */
    this.scene = new Scene()

    // Sizes
    const sizes = {
        width: window.innerWidth,
        height: window.innerHeight
    }

    // Camera
    this.camera = new PerspectiveCamera(75, sizes.width / sizes.height)
    this.camera.position.z = 3
    this.scene.add(this.camera)
    // Renderer
    this.renderer = new WebGLRenderer({
      canvas: this.canvas
    })
    this.renderer.setSize(sizes.width, sizes.height)
    // Controls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement );

    // Objects
    const geometry = new BoxGeometry(1, 1, 1)
    const material = new MeshBasicMaterial({ color: 0xff0000, wireframe: true })
    const mesh = new Mesh(geometry, material)

    this.scene.add(mesh)


    this.renderer.render(this.scene, this.camera)
    this.#raf()
  }
  

  #raf = () => {
    window.requestAnimationFrame( this.#raf );

    this.controls.update();
  
    this.renderer.render( this.scene, this.camera );
  }
}