import {
  AmbientLight,
  CircleGeometry,
  DirectionalLight,
  DoubleSide,
  EdgesGeometry,
  LineBasicMaterial,
  LineSegments,
  Mesh,
  MeshBasicMaterial,
  Scene,
  SphereGeometry,
  Vector3,
} from "three";
import { state } from "../Utils/State";
import TestPlane from "../Objects/TestPlane";
import WebglController from "../WebglController";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { EVENTS } from "../Constants/events";
import gsap from "gsap";

class Bridge extends Scene {
  constructor() {
    super();
    state.register(this);

    this.webgl = new WebglController();

    this.light = new AmbientLight({ color: 0x000000, intensity: 1.0 });

    this.add(this.light);
    // Controls
    this.controls = new OrbitControls(
      this.webgl.camera,
      this.webgl.renderer.domElement
    );

    this.pane = this.webgl.pane;
    if (this.pane) this.initPane();

    this.angle = 0;
    this.radius = 0.5;
    this.center = new Vector3(-1, -0.98, 0.1);
  }

  initPane() {
    this.pane
      .addBinding(
        {
          progress: 0,
          theme: "dark",
        },
        "progress",
        {
          min: 0,
          max: 1,
          step: 0.01,
        }
      )
      .on("change", function (ev) {
        console.log(`change: ${ev.value}`);
      });
  }

  onAttach() {
    this.bridge = this.webgl.assetsManager.get("bridge");
    this.bridge.position.set(-0.8, -1, -2.2);
    this.bridge.rotation.y = -0.3;

    this.add(this.bridge);

    this.rock = this.webgl.assetsManager.get("rock");
    this.rock.scale.set(0.2, 0.2, 0.2);
    this.rock.position.set(-0.5, -0.98, -0.1);

    this.add(this.rock);

    this.player = new Mesh(
      new SphereGeometry(0.1, 10, 10),
      new MeshBasicMaterial({ color: 0x0055ff })
    );

    this.add(this.player);

    this.circleGeo = new CircleGeometry(0.5, 40);
    this.circle = new LineSegments(
      new EdgesGeometry(this.circleGeo),
      new LineBasicMaterial({ color: 0xffffff })
    );

    this.circle.rotation.x = Math.PI / 2;

    // this.add(this.circle);

    this.target = new Mesh(
      new CircleGeometry(0.1, 20),
      new MeshBasicMaterial({ color: 0xffffff, side: DoubleSide })
    );

    this.target.rotation.x = Math.PI / 2;

    this.add(this.target);

    this.updatePos();
  }

  onTick() {
    this.angle += 0.05;

    if (!this.target) return;

    this.x = this.center.x + this.radius * Math.cos(this.angle);
    this.z = this.center.z + this.radius * Math.sin(this.angle);

    this.target.position.set(this.x, -0.94, this.z);
  }

  onKeyDown(e) {
    if (this.target.position.distanceTo(this.rock.position) > 0.15) return;
    gsap.to(this.center, {
      x: -0.5,
      y: -0.98,
      z: -0.1,
      duration: 1,
      onUpdate: () => {
        this.updatePos();
      },
    });
  }

  updatePos() {
    this.circle.position.set(this.center.x, this.center.y, this.center.z);
    this.player.position.set(this.center.x, -0.88, this.center.z);
  }
}

export { Bridge };
