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
import Spirit from "../Objects/Spirit";

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
    this.directionLight.intensity = 3;
    this.directionLight.position.set(7, 10, 15);
    this.add(this.directionLight);

    // const sunHelper = new DirectionalLightHelper(this.sun, 3);
    // this.add(sunHelper);

    // const helper = new DirectionalLightHelper(this.directionLight, 3);
    // this.add(helper);

    // this.position.set(2, 0, -1.5);

    //States : off / start / step_1 / step_2 / step_3 / end
    this.state = "off";
  }

  init() {
    if (DEV_MODE) {
      this.pane = new Pane({ title: "Parameters Bridge", expanded: true });
    }

    this.angle = 0;
    this.direction = 1;
    this.radius = 0.7;
    this.center = new Vector3(-1, -0.98, -1.45);
    this.rockIndex = 0;
    this.minSpeed = 0.01;
  }

  onAttach() {
    this.bridge = this.webgl.assetsManager.get("bridge");
    this.bridge.position.set(-0.5, -1, -3.7);
    this.bridge.rotation.y = -0.5;
    this.add(this.bridge);

    console.log(this.bridge);

    //Remove reflection from material
    this.bridge.traverse((child) => {
      if ((child.isMesh && child.name === "Water") || child.name == "Ground") {
        // child.material.metalness = 0;
        child.material.roughness = 1;
      }
    });

    this.rock = this.webgl.assetsManager.get("rock");
    this.rockPos = new Vector3(-0.3, -1.2, -1.6);
    this.rockScale = new Vector3(0.15, 0.15, 0.15);
    this.rocks = [];

    for (let i = 0; i < 3; i++) {
      const rockClone = this.rock.clone();
      rockClone.scale.copy(this.rockScale);
      rockClone.position.set(
        this.rockPos.x + this.radius * i,
        this.rockPos.y,
        this.rockPos.z
      );
      this.add(rockClone);
      this.rocks.push(rockClone);
    }

    this.rocks[0].position.set(this.rockPos.x, -1, -1.6);

    this.player = this.webgl.assetsManager.get("milo").clone();
    this.player.scale.set(0.1, 0.1, 0.1);
    this.player.rotation.y = 30;

    this.add(this.player);

    this.spirit = new Spirit();
    this.spirit.rotation.x = Math.PI / 2;
    this.spirit.scale.set(0, 0, 0);

    this.add(this.spirit);

    this.updatePos();

    this.webgl.audio.playMusic("music_1");

    setTimeout(() => {
      this.#start();
    }, 1000);
  }

  onTick() {
    if (this.state == "off") return;
    let normalizedAngle = this.angle / (Math.PI / 2);

    // Calculate easing based on the current angle's distance from the center
    let easing = 1 - Math.abs(normalizedAngle);

    // Calculate new angle based on easing
    let angleIncrement = (0.05 * easing + this.minSpeed) * this.direction;
    this.angle += angleIncrement;

    if (this.angle >= Math.PI / 2 || this.angle <= -Math.PI / 2) {
      this.direction *= -1;
    }

    if (!this.spirit) return;

    this.x = this.center.x + this.radius * Math.cos(this.angle - 0.2);
    this.z = this.center.z + this.radius * Math.sin(this.angle - 0.2);

    this.spirit.position.set(this.x, -0.9, this.z);
  }

  onPointerDown() {
    console.log("pointerdown");
    if (this.webgl.currentScene != 4 || this.state == "off") return;

    this.currentRock = this.rocks[this.rockIndex];

    this.nextRock = this.rocks[this.rockIndex + 1];

    if (!this.currentRock) return;
    if (this.spirit.position.distanceTo(this.currentRock.position) > 0.3)
      return;

    this.spirit.hide();

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
        this.spirit.show();
      },
    });

    if (!this.nextRock) {
      state.emit(EVENTS.VIEW_COLLECTION_CAIRNS, 4);
      return;
    }

    gsap.to(this.rocks[this.rockIndex + 1].position, {
      y: -0.98,
      ease: "power4.out",
      duration: 1,
    });
  }

  updatePos() {
    this.player.position.set(this.center.x, -0.95, this.center.z);
  }

  #off() {}

  #start() {
    //Create all animations of apparitions
    this.state = "step_1";

    //launch spirit
    this.spirit.show();

    //launch Particles
  }

  clear() {
    if (DEV_MODE) {
      this.pane.dispose();
    }
  }
}

export { Bridge };
