import { Scene, BoxGeometry, MeshBasicMaterial, Mesh, PerspectiveCamera, WebGLRenderer, LoadingManager, TextureLoader, Color } from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { Plane } from './Objects/plane';

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
    this.controls = new OrbitControls(this.camera, this.renderer.domElement );

    // Objects
    // const geometry = new BoxGeometry(1, 1, 1)
    // const material = new MeshBasicMaterial({ color: 0xff0000, wireframe: true })
    // const mesh = new Mesh(geometry, material)

    // this.scene.add(mesh)


    this.renderer.render(this.scene, this.camera)
    this.#raf()
  }

  assetLoad() {
    console.log(this.planeTexture);

    const plane0 = new Plane('0', this.planeTexture[0])
    plane0.position.y = 1.5
    plane0.setScale(5)
    const plane1 = new Plane('1', this.planeTexture[1])
    plane1.setScale(5)
    plane1.position.z = 0.2
    plane1.position.y = 0.5
    const plane2 = new Plane('2', this.planeTexture[2])
    plane2.setScale(10)
    plane2.position.z = 0.4
    const plane3 = new Plane('3', this.planeTexture[3])
    plane3.setScale(8)
    plane3.position.z = 0.6
    plane3.position.y = -1.3

    this.scene.add(plane0, plane1, plane2, plane3)
  }

  #raf = () => {
    window.requestAnimationFrame( this.#raf );

    this.controls.update();
  
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