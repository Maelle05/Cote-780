import { app } from "@/App";
import { state } from "@/utils/State";
import { AnimationMixer, MathUtils, MeshBasicMaterial } from "three";
import { Group } from "three";
import { DuranceMaterial } from "../materials/Durance/material";

export default class Durance extends Group{
  constructor(baseTex, sceneId) {
    super()
    state.register(this);

    this.scene = sceneId
    this.baseTex = baseTex
  }

  onAttach(){
    this.model = app.assetsManager.get('durance').clone();
    this.model.children[0].material = new DuranceMaterial({ 
      uniforms: { 
        uBaseTex: { value: this.baseTex },
        uProgress: { value: 0 }
      },
      transparent: true,
      
    })
    // this.model.children[0].material = new MeshBasicMaterial({ map: this.baseTex})
    this.model.children[0].renderOrder = 1

    this.add(this.model)

    // console.log(this.model);

    this.isActive = false;


    // Init anim
    this.targetProgressAnim = 0;
    this.currentProgressAnim = 0;

    this.animationMixer = new AnimationMixer(this.model);
    this.animationClip = this.model.animations[0]
    this.animationAction = this.animationMixer.clipAction(this.animationClip);
    this.animationAction.play();
    this.animationAction.paused = true;
  }

  onTick(){
    if(!this.model && app.sceneshandler.currentScene != this.scene) return

    this.currentProgressAnim = MathUtils.lerp(
      this.currentProgressAnim,
      this.targetProgressAnim,
      0.02
    );
    // console.log(this.currentProgressAnim, this.scene);
    this.animationAction.paused = false;
    this.animationMixer.setTime(
      this.animationClip.duration * this.currentProgressAnim
    );
    this.animationAction.paused = true;
    this.animationMixer.update(app.ticker.delta);

    this.model.children[0].material.opacity = this.currentProgressAnim * 1.5;
    // this.model.children[0].material.uniforms.uProgress.value = this.currentProgressAnim;

  }

  show(){
    this.targetProgressAnim = 1;
    this.isActive = true;
  }

  hide(){
    this.targetProgressAnim = 0;
    this.isActive = false;
  }
}
