import { Scene, MeshMatcapMaterial, AmbientLight, DoubleSide, Raycaster } from 'three'
import { state } from '../../utils/State';
import { Pane } from 'tweakpane';
import { Mesh } from 'three';
import { PlaneGeometry } from 'three';
import { MeshBasicMaterial } from 'three';
import { SphereGeometry } from 'three';
import gsap from 'gsap';
import { DEV_MODE } from '../../utils/constants/config';
import { EVENTS } from "../../utils/constants/events";
import { CamAnim } from "../utils/CamAnim";
import { app } from '@/App';

class Spirit extends Mesh {
  constructor() {
    super()

    this.allPos = [
      { x: 5.8, y: 0.7, z: 1.9 },
      { x: 5, y: 1, z: 1 },
      { x: 5.5, y: 0.8, z: 2.4 },
    ]
    this.currentPos = 2
    this.currentLife = 4
    this.isCaptured = false

    this.geometry = new SphereGeometry(0.1, 32, 16)
    this.material = new MeshBasicMaterial({ color: 'white', transparent: true })

    this.position.set(this.allPos[this.currentPos].x, this.allPos[this.currentPos].y, this.allPos[this.currentPos].z)

    this.tl = gsap.timeline({ onComplete: () => {
      this.changePos()
    }});
    this.tl.to(this.material, { opacity: 1, duration: .3 })
    this.tl.to(this.material, { opacity: 0.2, duration: 1 })
    this.tl.to(this.material, { opacity: 1, duration: 1 })
    this.tl.to(this.material, { opacity: 0, duration: 1 })

    this.anim()
  }

  anim(){
    if(this.isCaptured) return
    this.tl.restart()
    this.tl.play()
  }

  updateLife(){
    this.isOnTransit = true
    this.currentLife = this.currentLife - 1
    switch (this.currentLife) {
      case 3: 
        this.material.color.setHex(0xacc8e4)
        this.changePos()
        break;

      case 2: 
        this.material.color.setHex(0x809bbf)
        this.changePos()
      break;

      case 1:
        this.material.color.setHex(0x53a0ec)
        this.changePos()
        break;

      case 0:
        this.material.color.setHex(0x1a80e6)
        this.isCaptured = true
        state.emit(EVENTS.VIEW_COLLECTION_CAIRNS, app.webgl.currentScene)
        break;
    
      default:
        break;
    }
  }

  changePos(){
    this.currentPos = (this.currentPos + 1) % this.allPos.length
    this.position.set(this.allPos[this.currentPos].x, this.allPos[this.currentPos].y, this.allPos[this.currentPos].z)
    this.anim()
  }
}

class Dam extends Scene {
	constructor() {
        super()
        state.register(this)

        this.raycaster = new Raycaster()

        this.PARAMS = {
          scenePos: {
            x: -3.2,
            y: -2.4,
            z: -5.2,
          },
          sceneRot: {
            x: 0,
            y: 0,
            z: 0,
          },
          persoPos: {
            x: 4.4,
            y: 0.5,
            z: 5.6,
          },
          spiritPos: {
            x: 0,
            y: 0,
            z: 0,
          },
          rocksPos: {
            x: -1.1,
            y: -1.5,
            z: 2.4,
          }
        }

        this.nbClick = 0
	}

  onAttach(){
      // console.log('Attach Dam')
      this.scene = app.assetsManager.get('dam');
      this.scene.traverse((el) => {
        el.material = new MeshMatcapMaterial({ matcap: app.assetsManager.get('matcap')})
      })
      this.add(this.scene);

      this.light = new AmbientLight({ color: 0xffffff });
      this.add(this.light);

      this.player = app.assetsManager.get("milo").clone();
      this.player.position.set(this.PARAMS.persoPos.x, this.PARAMS.persoPos.y, this.PARAMS.persoPos.z)
      this.player.scale.set(0.15, 0.15, 0.15)
      this.add(this.player);

      this.spirit = new Spirit()
      this.add(this.spirit)

      this.rocks = app.assetsManager.get('rocks')
      this.rocks.traverse((el) => { el.material = new MeshMatcapMaterial({ matcap: app.assetsManager.get('matcap'), transparent: true})})
      this.rocks.position.set(this.PARAMS.rocksPos.x, this.PARAMS.rocksPos.y, this.PARAMS.rocksPos.z)
      this.rocks.scale.set(1.5, 1.5, 1.5)
      this.add(this.rocks)


      this.anim = new CamAnim(3, this.scene, [0, 0.25, 0.5, 0.75, 1]);

      if(app.webgl.currentScene === 3) this.init()  
  }

  init(){
    // console.log('Init Dam')
    if (DEV_MODE) {
      this.pane = new Pane({ title: 'Parameters Dam', expanded: false });
      this.pane.addBinding(this.PARAMS, 'sceneRot', {
        min: -180,
        max: 180,
        step: 0.1
      }).on('change', (ev) => {
        this.scene.rotation.set(ev.value.x / (180 / Math.PI), ev.value.y / (180 / Math.PI), ev.value.z / (180 / Math.PI))
      });
      this.pane.addBinding(this.PARAMS, 'scenePos', {
        min: -10,
        max: 10,
        step: 0.1
      }).on('change', (ev) => {
        this.scene.position.set(ev.value.x, ev.value.y, ev.value.z)
      });
      this.pane.addBinding(this.PARAMS, 'persoPos', {
        min: -10,
        max: 10,
        step: 0.1
      }).on('change', (ev) => {
        this.player.position.set(ev.value.x, ev.value.y, ev.value.z)
      });
      this.pane.addBinding(this.PARAMS, 'spiritPos', {
        min: -10,
        max: 10,
        step: 0.1
      }).on('change', (ev) => {
        this.spirit.position.set(ev.value.x, ev.value.y, ev.value.z)
      });
      this.pane.addBinding(this.PARAMS, 'rocksPos', {
        min: -10,
        max: 10,
        step: 0.1
      }).on('change', (ev) => {
        this.rocks.position.set(ev.value.x, ev.value.y, ev.value.z)
      });
    }
  }

  onPointerDown(e){
    if(app.webgl.currentScene != 3) return
    if(this.anim.currentKeyfame != 2) return

    this.raycaster.setFromCamera(e.webgl, app.webgl.camera);
    const intersects = this.raycaster.intersectObject( this.spirit );

    if (intersects.length != 0) {
      this.nbClick = this.nbClick + 2
      this.spirit.updateLife()
      if(this.spirit.isCaptured){
        gsap.to(this.spirit.position, {
          x: this.player.position.x,
          y: this.player.position.y,
          z: this.player.position.z,
        })
  
        gsap.to(this.spirit.scale, {
          x: 0,
          y: 0,
          z: 0,
        })
      }


      gsap.to(this.rocks.children.find((el) => el.name === 'Pierre' + (this.nbClick - 1)).material, {
        opacity: 0,
      })
      gsap.to(this.rocks.children.find((el) => el.name === 'Pierre' + this.nbClick).material, {
        opacity: 0,
      })
    }
  }

  clear(){
    if (DEV_MODE) {
      this.pane.dispose()
    }
  }
}

export { Dam };