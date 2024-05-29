import { DirectionalLight, AmbientLight, Scene, Raycaster } from "three";
import { state } from "../Utils/State";
import Plan from "../Objects/Plan";
import WebglController from "../WebglController";
import { Pane } from "tweakpane";
import { DEV_MODE } from "../Constants/config";
import { EVENTS } from '../Constants/events';
import {Text} from 'troika-three-text'
import { TITLES_SCENE } from '../Constants/config.js';

class Map extends Scene {
  constructor() {
    super();
    state.register(this);

    this.webgl = new WebglController();
    this.raycaster = new Raycaster();


    this.ambient = new AmbientLight({ color: 0xFFFFFF, intensity: 0.1})
    this.light = new DirectionalLight({ color: 0x000000, intensity: 1.0 });
    this.light.position.set(0, 10, 0);
    // this.light.castShadow = true;
    // this.light.shadow.mapSize.width = 2048;
    // this.light.shadow.mapSize.height = 2048;

    this.add(this.light, this.ambient);

    this.PARAMS = {
      pointPos: {
        x: 0,
        y: 0.6,
        z: 0,
      }
    }
  }

  init() {
    if (DEV_MODE) {
      this.pane = new Pane({ title: "Parameters Map", expanded: true });
      this.pane.addBinding(this.PARAMS, 'pointPos', {
        min: -10,
        max: 10,
        step: 0.1
      }).on('change', (ev) => {
        this.plan.point.position.set(ev.value.x, ev.value.y, ev.value.z)
      });
    }
  }

  onAttach() {
    this.plan = new Plan();
    this.plan.position.set(0, 0, -7);
    this.plan.rotation.x = 20
    this.add(this.plan);

    this.text = new Text()
    this.text.text = ''
    this.text.fontSize = 0.2
    this.text.color = 'red'
    this.add(this.text)
    this.text.sync()
  }

  onPointerDown(e){
    if(this.webgl.currentScene != 1) return

    this.raycaster.setFromCamera(e.webgl, this.webgl.camera);
    const intersects = this.raycaster.intersectObjects( this.plan.allPoint );

    if (intersects.length != 0 && intersects[0].object.name == '2') {
      state.emit(EVENTS.CHANGE_SCENE, parseInt(intersects[0].object.name))
    }
  }

  onPointerMove(e){
    if(this.webgl.currentScene != 1) return

    this.raycaster.setFromCamera(e.webgl, this.webgl.camera);
    const intersects = this.raycaster.intersectObjects( this.plan.allPoint );

    if (intersects.length != 0) {
      this.text.text = TITLES_SCENE[parseInt(intersects[0].object.name)]
      this.text.position.set(intersects[0].point.x, intersects[0].point.y + 0.5, intersects[0].point.z + 0.5)
      this.text.sync()
    } else {
      this.text.text = ''
      this.text.sync()
    }
  }

  clear() {
    if (DEV_MODE) {
      this.pane.dispose();
    }
  }
}

export { Map };
