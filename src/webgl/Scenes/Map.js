import { Scene } from 'three'
import { state } from '../Utils/State';
import Plan from '../Objects/Plan'
import WebglController from '../WebglController';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { EVENTS } from '../Constants/events';

class Map extends Scene {
	constructor() {
        super()
        state.register(this)

        this.webgl = new WebglController()


        // Controls
        this.controls = new OrbitControls(this.webgl.camera, this.webgl.renderer.domElement);

        this.pane = this.webgl.pane
        if(this.pane) this.initPane()
	}

    initPane(){
    }

    onAttach(){
        this.plan = new Plan();
        console.log(this.plan);
        this.add(this.plan);
    }
}

export { Map };