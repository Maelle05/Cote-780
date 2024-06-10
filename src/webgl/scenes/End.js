import { AmbientLight, DoubleSide, Scene, Vector3 } from "three";
import { state } from "../../utils/State";
import TestPlane from "../objects/TestPlane";
import { Pane } from "tweakpane";
import { PlaneGeometry } from "three";
import { MeshBasicMaterial } from "three";
import { Mesh } from "three";
import Fireworks from "../objects/Fireworks";
import { DEV_MODE } from "../../utils/constants/config";
import { app } from "@/App";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { SpritesheetPlayer } from "../utils/SpritesheetPlayer";
import { CamAnim } from "../utils/CamAnim";
import { DirectionalLight } from "three";
import { WaterMaterial } from "../materials/Water/material";

class End extends Scene {
  constructor() {
    super();
    state.register(this);

    this.allPos = [
      { x: -10, y: 0.01, z: 6 },
      { x: -15, y: 0.01, z: 3 },
      { x: -9, y: 0.01, z: -3 },
      { x: -8, y: 0.01, z: 3 },
      { x: -12, y: 0.01, z: 0 },
      { x: -11, y: 0.01, z: 3 },
    ];

    this.PARAMS = {
      planePos: {
        x: 0,
        y: 1,
        z: 0,
      },
    };

    this.light = new AmbientLight({ color: 0xffffff });
    this.add(this.light);

    this.directionLight = new DirectionalLight(0xffffff);
    this.directionLight.intensity = 2;
    this.directionLight.position.set(7, 10, 15);
    this.add(this.directionLight);
  }

  init() {
    if (DEV_MODE) {
      this.pane = new Pane({ title: "Parameters End", expanded: true });
      this.pane
        .addBinding(this.PARAMS, "planePos", {
          min: -10,
          max: 10,
          step: 0.1,
        })
        .on("change", (ev) => {
          this.planePos.position.set(ev.value.x, ev.value.y, ev.value.z);
        });
    }
  }

  onAttach() {
    this.fireworks = new Fireworks(this.allPos);
    this.fireworks.launchers.forEach((launcher) => this.add(launcher));
    this.fireworks.explosions.forEach((explosions) => this.add(explosions));

    console.log(this.fireworks);

    setTimeout(() => {
      this.fireworks.launchers.forEach((launcher) =>
        this.fireworks.play(launcher)
      );
    }, 2000);

    this.test = new SpritesheetPlayer("explosion1");

    this.testSprite = new Mesh(
      new PlaneGeometry(1, 1, 1, 1),
      this.test.material
    );

    this.testSprite.lookAt(app.webgl.camera.position);

    this.testSprite.position.set(-5, 2, 0);
    this.testSprite.rotation.y = Math.PI / 2;
    this.add(this.testSprite);

    this.planePos = new Mesh(
      new PlaneGeometry(1, 1, 1, 1),
      new MeshBasicMaterial({ color: 0xff0000, side: DoubleSide })
    );
    this.planePos.rotation.x = Math.PI / 2;
    this.planePos.visible = false;
    this.add(this.planePos);

    this.end = app.assetsManager.get("end");
    this.end.traverse((el) => {
      if (el.name == "WaterSurface") {
        this.water = el;
        el.material = new WaterMaterial({
          uniforms: {
            uTexture: { value: el.material.map },
            uTime: { value: 0 },
          },
          transparent: true,
        });
      }
    });

    this.ambient = new AmbientLight({ color: 0xffffff, intensity: 0.1 });

    this.add(this.end, this.ambient);

    // this.anim = new CamAnim(7, this.end, [0, 0.33, 0.66, 1]);

    if (!this.anim) {
      const controls = new OrbitControls(
        app.webgl.camera,
        app.webgl.renderer.domElement
      );
    }

    if (app.webgl.currentScene === 7) this.init();
  }

  onTick() {
    if (this.water)
      this.water.material.uniforms.uTime.value = app.ticker.elapsed;
  }

  clear() {
    if (DEV_MODE) {
      this.pane.dispose();
    }
  }

  onResize() {}
}

export { End };
