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
  HemisphereLight,
  Vector3,
} from "three";
import { state } from "../Utils/State";
import TestPlane from "../Objects/TestPlane";
import WebglController from "../WebglController";
import { EVENTS } from "../Constants/events";
import gsap from "gsap";
import { Pane } from "tweakpane";
import { DirectionalLightHelper } from "three";
import { DEV_MODE } from "../Constants/config";

class Bridge extends Scene {
  constructor() {
    super();
    state.register(this);

    this.webgl = new WebglController();

    this.light = new AmbientLight({ color: 0xffffff });
    this.add(this.light);

    this.sun = new DirectionalLight(0xffffff);
    this.sun.intensity = 1;
    this.sun.position.set(-7, 10, -15);
    this.add(this.sun);

    this.directionLight = new DirectionalLight(0xffffff);
    this.directionLight.intensity = 0.5;
    this.directionLight.position.set(7, 10, 15);
    this.add(this.directionLight);

    // const sunHelper = new DirectionalLightHelper(this.sun, 3);
    // this.add(sunHelper);

    // const helper = new DirectionalLightHelper(this.directionLight, 3);
    // this.add(helper);

    // this.position.set(2, 0, -1.5);

    this.angle = 0;
    this.radius = 0.7;
    this.center = new Vector3(-1, -0.98, -1.45);
    this.rockIndex = 0;
    this.rocks;
  }

  init() {
    if (DEV_MODE) {
      this.pane = new Pane({ title: "Parameters Bridge", expanded: true });
    }
  }

  onAttach() {
    this.bridge = this.webgl.assetsManager.get("bridge");
    this.bridge.position.set(-0.5, -1, -3.7);
    this.bridge.rotation.y = -0.5;
    this.bridge.traverce;
    this.add(this.bridge);

    this.bridge.traverse((child) => {
      if ((child.isMesh && child.name === "Water") || child.name == "Ground") {
        // child.material.metalness = 0;
        child.material.roughness = 1;
      }
    });

    this.rockPosX = -0.3;

    this.rock = this.webgl.assetsManager.get("rock");
    this.rock.scale.set(0.15, 0.15, 0.15);
    this.rock.position.set(this.rockPosX, -1, -1.6);

    this.add(this.rock);

    this.rock1 = this.rock.clone();
    this.rock1.scale.set(0.15, 0.15, 0.15);
    this.rock1.position.set(this.rockPosX + this.radius, -1.2, -1.6);

    this.add(this.rock1);

    this.rock2 = this.rock.clone();
    this.rock2.scale.set(0.15, 0.15, 0.15);
    this.rock2.position.set(this.rockPosX + this.radius * 2, -1.2, -1.6);

    this.add(this.rock2);
    this.rocks = [this.rock, this.rock1, this.rock2];

    this.player = this.webgl.assetsManager.get("milo").clone();
    this.player.scale.set(0.1, 0.1, 0.1);
    this.player.rotation.y = 30;

    this.add(this.player);

    this.target = new Mesh(
      new SphereGeometry(0.03, 20, 20),
      new MeshBasicMaterial({ color: 0xffffff, side: DoubleSide })
    );
    this.target.rotation.x = Math.PI / 2;

    this.add(this.target);

    this.updatePos();

    this.webgl.audio.playMusic("music_1");
  }

  onTick() {
    this.angle += 0.05;

    if (!this.target) return;

    this.x = this.center.x + this.radius * Math.cos(this.angle);
    this.z = this.center.z + this.radius * Math.sin(this.angle);

    this.target.position.set(this.x, -0.9, this.z);
  }

  onKeyDown() {
    this.currentRock = this.rocks[this.rockIndex];
    this.nextRock = this.rocks[this.rockIndex + 1];

    if (!this.currentRock) return;
    if (this.target.position.distanceTo(this.currentRock.position) > 0.3)
      return;

    gsap.to(this.center, {
      x: this.currentRock.position.x,
      y: -0.98,
      z: this.currentRock.position.z,
      duration: 1,
      ease: "power1.out",
      onUpdate: () => {
        this.updatePos();
      },
      onComplete: () => {
        this.rockIndex++;
      },
    });

    if (!this.nextRock) return;

    gsap.to(this.rocks[this.rockIndex + 1].position, {
      y: -0.98,
      ease: "power4.out",
      duration: 1,
    });
  }

  updatePos() {
    this.player.position.set(this.center.x, -0.95, this.center.z);
  }

  clear() {
    if (DEV_MODE) {
      this.pane.dispose();
    }
  }
}

export { Bridge };
