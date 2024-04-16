import { Scene, PerspectiveCamera, WebGLRenderer, LoadingManager, TextureLoader, Color } from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { Plane } from './Objects/Plane';
import { ParallaxScene } from './Objects/ParallaxScene';

export class webgl {
  constructor(webglCanvas) {

    this.canvas = webglCanvas

    /*
     * Initialisation
     */
    this.scene = new Scene()
    // Loader
    const loadingManager = new LoadingManager()
    loadingManager.onStart = () => { console.log('loading started') }
    loadingManager.onLoad = () => {
      console.log('loading finished')
      this.assetLoad()
    }
    loadingManager.onProgress = () => { console.log('loading progressing') }
    loadingManager.onError = () => { console.log('loading error') }
    const textureLoader = new TextureLoader(loadingManager)

    // Textures
    this.planeTexture = [
      textureLoader.load('./0.png'),
      textureLoader.load('./1.png'),
      textureLoader.load('./2.png'),
      textureLoader.load('./3.png'),
      textureLoader.load('./4.png'),
    ]

    // Sizes
    this.sizes = {
        width: window.innerWidth,
        height: window.innerHeight
    }
    window.addEventListener('resize', this.resize)

    // Camera
    this.camera = new PerspectiveCamera(75, this.sizes.width / this.sizes.height)
    this.camera.position.z = 3
    this.scene.add(this.camera)
    // Renderer
    this.renderer = new WebGLRenderer({
      canvas: this.canvas
    })
    this.renderer.setSize(this.sizes.width, this.sizes.height)
    this.renderer.setClearColor(new Color('#BEE0E1'))

    // Controls
    // this.controls = new OrbitControls(this.camera, this.renderer.domElement );

    // Objects

    this.renderer.render(this.scene, this.camera)
    this.#raf()
  }

  assetLoad() {
    this.parallax = new ParallaxScene('Mountain parallax', this.planeTexture, 8)

    this.scene.add(this.parallax)
  }

  #raf = () => {
    window.requestAnimationFrame( this.#raf );

    // this.controls.update();
  
    this.renderer.render( this.scene, this.camera );
  }

  resize = () => {
    // Update sizes
    this.sizes.width = window.innerWidth
    this.sizes.height = window.innerHeight

    // Update camera
    this.camera.aspect = this.sizes.width / this.sizes.height
    this.camera.updateProjectionMatrix()

    // Update renderer
    this.renderer.setSize(this.sizes.width, this.sizes.height)
  }
}