import {
  Scene,
  MeshMatcapMaterial,
  MeshBasicMaterial,
  Group,
  CanvasTexture,
  Raycaster,
  AmbientLight,
} from "three";
import { state } from "../Utils/State";
import WebglController from "../WebglController";
import { Pane } from "tweakpane";
import { HeaddressesMaterial } from "../Materials/Headdresses/material";
import { gsap } from "gsap";
import { DEV_MODE } from "../Constants/config";
import { EVENTS } from "../Constants/events";

class Demoiselle extends Group {
  constructor(body, top, color) {
    super();
    state.register(this);

    this.webgl = new WebglController();
    this.raycaster = new Raycaster();

    // Canvas texture
    this.sizeCanvas = 300;
    this.color = this.extractRGBParameters(color);
    this.canvas = document.createElement("canvas");
    this.canvas.width = this.sizeCanvas;
    this.canvas.height = this.sizeCanvas;
    this.ctx = this.canvas.getContext("2d", { willReadFrequently: true });
    this.ctx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${
      this.color.b
    }, ${0.2})`;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.canvasTex = new CanvasTexture(this.canvas);
    // document.querySelector('#vue-app').appendChild(this.canvas)

    body.material = new MeshBasicMaterial({ color: color });
    top.material = new HeaddressesMaterial({
      uniforms: {
        uTex: { value: this.canvasTex },
      },
    });

    this.body = body;
    this.top = top;
    this.topIsDraw = false;
  }

  onPointerMove(e) {
    if (this.topIsDraw) return;
    if (this.webgl.currentScene != 2) return;

    // update the picking ray with the camera and pointer position
    this.raycaster.setFromCamera(e.webgl, this.webgl.camera);

    // calculate objects intersecting the picking ray
    const intersects = this.raycaster.intersectObject(this.top);

    for (let i = 0; i < intersects.length; i++) {
      // intersects[ i ].object.material.opacity = 1;
      this.drawOnCanvasTex(intersects[i].uv);
    }

    if (this.isCanvasPainted()) {
      this.ctx.fillStyle = `rgb(${this.color.r}, ${this.color.g}, ${this.color.b})`;
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      this.topIsDraw = true;

      gsap.to(this.top.position, {
        x: this.body.position.x,
        y: this.body.position.y + 17,
        z: this.body.position.z,
      });
    }
  }

  drawOnCanvasTex(coords) {
    const radius = 10;
    const x = coords.x * this.sizeCanvas;
    const y = coords.y * this.sizeCanvas;
    const color = `rgb(${this.color.r}, ${this.color.g}, ${this.color.b})`;

    this.ctx.beginPath();
    this.ctx.arc(x, y, radius, 0, 2 * Math.PI);
    this.ctx.fillStyle = color;
    this.ctx.fill();

    // Create a texture from the canvas
    this.canvasTex.needsUpdate = true;
  }

  extractRGBParameters(rgbString) {
    const regex = /rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)/;
    const match = rgbString.match(regex);

    // If the string matches the regex, return the parameters as numbers
    if (match) {
      return {
        r: parseInt(match[1], 10),
        g: parseInt(match[2], 10),
        b: parseInt(match[3], 10),
      };
    } else {
      // If no match, return null or throw an error
      return null;
    }
  }

  isCanvasPainted() {
    const imageData = this.ctx.getImageData(
      0,
      0,
      this.canvas.width,
      this.canvas.height
    );
    const data = imageData.data;

    const results = [];

    for (let i = 0; i < data.length; i += 4) {
      if (data[i + 3] > 200) {
        results.push(true);
      } else {
        results.push(false);
      }
    }

    const note = results.filter((el) => el == true).length / results.length;

    if (note > 0.08) {
      return true; // Canvas painted
    } else {
      return false;
    }
  }
}

class Ladies extends Scene {
  constructor() {
    super();
    state.register(this);

    this.webgl = new WebglController();

    this.PARAMS = {
      scenePos: {
        x: -2.6,
        y: -1.0,
        z: 0.9,
      },
      rotateY: -86.1,
      rotateX: -3.9,
    };

    this.finish = false;
  }

  init() {
    if (DEV_MODE) {
      this.pane = new Pane({ title: "Parameters Ladies", expanded: true });
      this.pane
        .addBinding(this.PARAMS, "rotateY", {
          min: -180,
          max: 180,
          step: 0.1,
        })
        .on("change", (ev) => {
          this.ladies.rotation.y = ev.value / (180 / Math.PI);
        });
      this.pane
        .addBinding(this.PARAMS, "rotateX", {
          min: -180,
          max: 180,
          step: 0.1,
        })
        .on("change", (ev) => {
          this.ladies.rotation.x = ev.value / (180 / Math.PI);
        });
      this.pane
        .addBinding(this.PARAMS, "scenePos", {
          min: -10,
          max: 10,
          step: 0.1,
        })
        .on("change", (ev) => {
          this.ladies.position.set(ev.value.x, ev.value.y, ev.value.z);
        });
    }
  }

  onPointerMove() {
    if (
      this.dem1.topIsDraw &&
      this.dem2.topIsDraw &&
      this.dem3.topIsDraw &&
      !this.finish
    ) {
      state.emit(EVENTS.VIEW_COLLECTION_CAIRNS, 2);
      this.finish = true;
    }
  }

  onAttach() {
    this.demoiselles = new Group();
    this.D1 = [];
    this.D2 = [];
    this.D3 = [];

    this.ambient = new AmbientLight({ color: 0xffffff, intensity: 0.1 });
    this.ladies = this.webgl.assetsManager.get("ladies");
    this.ladies.traverse((el) => {
      el.material = new MeshMatcapMaterial({
        matcap: this.webgl.assetsManager.get("matcap"),
      });
      if (el.name == "dame1" || el.name == "top1") {
        el.material = new MeshBasicMaterial({ color: "green" });
        this.D1.push(el);
      }
      if (el.name == "dame2" || el.name == "top2") {
        el.material = new MeshBasicMaterial({ color: "blue" });
        this.D2.push(el);
      }
      if (el.name == "dame3" || el.name == "top3") {
        el.material = new MeshBasicMaterial({ color: "orange" });
        this.D3.push(el);
      }
    });
    this.ladies.scale.set(0.1, 0.1, 0.1);
    this.ladies.position.set(
      this.PARAMS.scenePos.x,
      this.PARAMS.scenePos.y,
      this.PARAMS.scenePos.z
    );
    this.ladies.rotation.x = this.PARAMS.rotateX / (180 / Math.PI);
    this.ladies.rotation.y = this.PARAMS.rotateY / (180 / Math.PI);

    this.dem1 = new Demoiselle(this.D1[0], this.D1[1], "rgb(0, 255, 0)");
    this.dem2 = new Demoiselle(this.D2[0], this.D2[1], "rgb(0, 0, 255)");
    this.dem3 = new Demoiselle(this.D3[0], this.D3[1], "rgb(255,165,0)");
    this.demoiselles.add(this.dem1, this.dem2, this.dem3);

    this.add(this.ladies, this.ambient);
  }

  clear() {
    if (DEV_MODE) {
      this.pane.dispose();
    }
  }
}

export { Ladies };
