import { Scene, MeshMatcapMaterial } from "three";
import { state } from "../../utils/State";
import { Pane } from "tweakpane";
import { DEV_MODE } from "../../utils/constants/config";
import { CamAnim } from "../utils/CamAnim";
import { app } from "@/App";
import Flame from "../Objects/Flame";
import Spirit from "../Objects/Spirit";
import { Raycaster } from "three";
import { Mesh } from "three";
import { Group } from "three";
import gsap from "gsap";

class Chapel extends Scene {
  constructor() {
    super();
    state.register(this);

    this.raycaster = new Raycaster();

    this.init()
  }

  init() {
    if (DEV_MODE) {
      this.pane = new Pane({ title: "Parameters Chapel", expanded: true });
    }

    this.torchs = [];
    this.flames = [];
  }

  onAttach() {
    this.chapel = app.assetsManager.get("chapel");
    this.chapel.traverse((el) => {
      el.material = new MeshMatcapMaterial({
        matcap: app.assetsManager.get("matcap"),
      });
    });
    this.add(this.chapel);

    this.torchs = this.chapel.children.filter((child) =>
      child.name.includes("Torch")
    );

    this.torchs.forEach((torch, index) => {
      const flame = new Flame();
      flame.position.set(
        torch.position.x,
        torch.position.y + 0.1,
        torch.position.z
      );
      torch.flame = flame;
      flame.visible = false;
      this.flames.push(flame);
      this.add(flame);
    });

    this.spirit = new Spirit();
    this.spirit.position.set(-1, this.torchs[0].position.y + 0.1, 0);
    this.add(this.spirit);

    this.anim = new CamAnim(
      5,
      this.chapel,
      app.webgl.camera,
      [0, 0.33, 0.66, 1]
    );

    this.anim.changeStep(2);
  }

  onPointerDown(e) {
    if (app.webgl.currentScene != 5) return;
    // if (this.anim.currentKeyfame != 2) return;

    this.raycaster.setFromCamera(e.webgl, app.webgl.camera);
    const intersects = this.raycaster.intersectObjects(this.torchs);

    if (intersects.length != 0) {
      this.goTo(intersects[0].object.flame);
    }
  }

  goTo(object) {
    // Define start point, control point, and end point
    const startPoint = {
      x: this.spirit.position.x,
      y: this.spirit.position.y,
      z: this.spirit.position.z,
    };
    const endPoint = {
      x: object.position.x,
      y: object.position.y,
      z: object.position.z,
    };
    const controlPoint = {
      x: (startPoint.x + 1 + endPoint.x) / 2,
      y: startPoint.y + 0.5,
      z: (startPoint.z + 1 + endPoint.z) / 2,
    };

    // Define the duration of the animation
    const duration = 1;

    // Define the Bezier interpolation function
    function bezierInterpolation(t, p0, p1, p2) {
      const x =
        (1 - t) * (1 - t) * p0.x + 2 * (1 - t) * t * p1.x + t * t * p2.x;
      const y =
        (1 - t) * (1 - t) * p0.y + 2 * (1 - t) * t * p1.y + t * t * p2.y;
      const z =
        (1 - t) * (1 - t) * p0.z + 2 * (1 - t) * t * p1.z + t * t * p2.z;
      return { x, y, z };
    }

    // Animate using GSAP with a custom onUpdate function
    gsap.to(
      { t: 0 },
      {
        t: 1,
        duration: duration,
        ease: "power1.inOut",
        onUpdate: function (e) {
          const t = this.targets()[0].t;
          const newPosition = bezierInterpolation(
            t,
            startPoint,
            controlPoint,
            endPoint
          );
          e.position.set(newPosition.x, newPosition.y, newPosition.z);
        },
        onComplete: () => {
          object.visible = true;
          this.spiritStand(object);
        },
        onUpdateParams: [this.spirit], // Pass the spirit object to onUpdate
      }
    );
  }

  spiritStand(object) {
    //TODO : CHANGE THIS ANIMATION
    // gsap.to(this.spirit.rotation, {
    //   duration: 2,
    //   repeat: -1,
    //   ease: "none",
    //   y: Math.PI * 2,
    //   onUpdate: () => {
    //     const angle = this.spirit.rotation.y;
    //     const radius = 0.1;
    //     const newX = object.position.x + Math.cos(angle) * radius;
    //     const newZ = object.position.z + Math.sin(angle) * radius;
    //     // Update the object position
    //     this.spirit.position.set(newX, object.position.y, newZ);
    //   },
    // });
  }

  onChangeSceneStep() {
    this.anim.changeStep();
  }

  clear() {
    if (DEV_MODE) {
      this.pane.dispose();
    }
  }
}

export { Chapel };
