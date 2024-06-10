import { app } from "@/App";
import { state } from "@/utils/State";
import { MeshBasicMaterial } from "three";
import { AnimationMixer, MathUtils } from "three";
import { Group } from "three";

export default class Durance extends Group{
  constructor() {
    super()
    state.register(this);
  }

  onAttach(){
    this.model = app.assetsManager.get('durance');
    this.model.children[0].material = new MeshBasicMaterial({ map: this.baseTex, transparent: true, opacity: 0})
    this.add(this.model)

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
    if(!this.model) return

    this.currentProgressAnim = MathUtils.lerp(
      this.currentProgressAnim,
      this.targetProgressAnim,
      0.02
    );

    this.animationAction.paused = false;
    this.animationMixer.setTime(
      this.animationClip.duration * this.currentProgressAnim
    );
    this.animationAction.paused = true;
    this.animationMixer.update(app.ticker.delta);

    this.model.children[0].material.opacity = this.currentProgressAnim * 1.5;
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
