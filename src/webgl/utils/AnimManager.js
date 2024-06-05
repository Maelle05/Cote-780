import { AnimationMixer } from "three";
import { state } from "../../utils/State";
import { AnimationClip } from "three";

class AnimManager {
  constructor(mesh) {
    state.register(this);

    console.log(mesh);
    this.mesh = mesh;
    this.animations = this.mesh.animations;
    this.mixer = new AnimationMixer(this.mesh);
    this.isAnimating = false;

    this.init();
  }

  onTick(e) {
    this.mixer.update(e.dt);
  }

  init() {
    this.idleAction = this.mixer.clipAction(this.animations[0]);
    this.jumpAction = this.mixer.clipAction(this.animations[1]);
    this.walkAction = this.mixer.clipAction(this.animations[2]);

    this.actions = [this.idleAction, this.walkAction, this.jumpAction];

    this.idleAction.play();
    this.currentAction = this.idleAction;
  }

  changeAction(action) {
    const duration = 0.5;

    if (this.isAnimating == true) return;

    action.reset().play().setEffectiveWeight(1).setEffectiveTimeScale(1);
    // action.enabled = true;
    this.currentAction.crossFadeTo(action, duration);
    this.previousAction = this.currentAction;
    this.currentAction = action;

    if (this.previousAction == action) return;
    this.isAnimating = true;

    setTimeout(() => {
      this.previousAction.enabled = false;
      this.previousAction.setEffectiveWeight(0);
      this.previousAction.setEffectiveTimeScale(0);
      this.isAnimating = false;
    }, duration * 1000 + 10);
  }

  jump() {
    console.log("first");
    this.changeAction(this.jumpAction);
  }

  walk() {
    this.changeAction(this.walkAction);
  }

  idle() {
    this.changeAction(this.idleAction);
  }
}

export { AnimManager };
