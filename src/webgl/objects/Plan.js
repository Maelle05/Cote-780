import {
  Mesh,
  PlaneGeometry,
  SphereGeometry,
  DoubleSide,
  MeshBasicMaterial,
} from "three";
import { PlanMaterial } from "../materials/Plan/material";
import { state } from "../../utils/State";
import App from "@/App.vue";
import { TITLES_SCENE } from "../../utils/constants/config.js";
import { app } from "@/App";

export default class Plan extends Mesh {
  constructor() {
    super();
    state.register(this);

    this.DATA = [
      {
        pos: { x: -3.0, y: 0.6, z: 1.7 },
        name: TITLES_SCENE[2],
        id: 2,
      },
      {
        pos: { x: -7.0, y: 0.6, z: 2.7 },
        name: TITLES_SCENE[3],
        id: 3,
      },
      {
        pos: { x: -4.3, y: 0.6, z: -1.3 },
        name: TITLES_SCENE[4],
        id: 4,
      },
      {
        pos: { x: -2.4, y: 0.6, z: -2.4 },
        name: TITLES_SCENE[5],
        id: 5,
      },
      {
        pos: { x: -0.8, y: 0.6, z: -2.2 },
        name: TITLES_SCENE[6],
        id: 6,
      },
      {
        pos: { x: 0, y: 0.6, z: -2.0 },
        name: TITLES_SCENE[7],
        id: 7,
      },
    ];

    this.allPoint = [];
  }

  onAttach() {
    this.map = app.assetsManager.get("map");
    this.add(this.map);

    this.DATA.forEach((el, i) => {
      const point = new Mesh(
        new SphereGeometry(0.1, 32, 16),
        new MeshBasicMaterial({ color: "red", transparent: true })
      );
      if (i != 0) point.material.opacity = 0.3;
      point.position.set(
        this.DATA[i].pos.x,
        this.DATA[i].pos.y,
        this.DATA[i].pos.z
      );
      point.name = this.DATA[i].id;
      this.allPoint.push(point);
      this.add(point);
    });

    // this.map.traverse((o) => {
    //   o.receiveShadow = true;
    //   o.castShadow = true;
    // })
  }
}
