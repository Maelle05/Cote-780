import { Mesh, PlaneGeometry, DoubleSide } from 'three';
import { PlanMaterial } from '../Materials/Plan/material';
import { state } from '../Utils/State';
import App from '@/App.vue';
import WebglController from '../WebglController';

export default class Plan extends Mesh {
  constructor() {
    super();
    state.register(this);
  }

  onAttach() {
    this.map = WebglController.instance.assetsManager.get("map");
    this.add(this.map);

    this.map = WebglController.instance.assetsManager.get("map");
    this.add(this.map);

    // this.map.traverse((o) => {
    //   o.receiveShadow = true;
    //   o.castShadow = true;
    // })
  }
}