import { AnimationMixer, MathUtils, Euler, Quaternion } from "three";
import { state } from '../State';
import { EVENTS } from '../../Constants/events';
import WebglController from "@/webgl/WebglController";


export class CamAnim {
  constructor(idScene, scene, targetObject, keyframes){
    state.register(this);

    this.webgl = new WebglController()
    this.idScene = idScene

    this.refCam = scene.children.find(el => el.name == "Camera")
    this.animationClip = scene.animations[0]
    this.targetObj = targetObject
    this.keyframes = keyframes
    this.currentKeyfame = 0

    this.rotTarget = new Euler(0, 0, 0, 'YXZ');
    this.offsetRot = new Euler(0, 0, 0, 'YXZ')
    this.currentProgressAnim = 0;
    this.targetProgressAnim = 0;

    // Init anim
    this.animationMixer = new AnimationMixer(this.refCam);
    this.animationAction = this.animationMixer.clipAction(this.animationClip);
    this.animationAction.play();
    this.animationAction.paused = true;

  }
  
  onTick(){
    if(!this.keyframes && this.keyframes.length == 0 || this.webgl.currentScene != this.idScene) return;
    if(this.webgl.camera != this.refCam) this.webgl.camera = this.refCam

    this.targetProgressAnim = this.keyframes[this.currentKeyfame];
    this.currentProgressAnim = MathUtils.lerp(
      this.currentProgressAnim,
      this.targetProgressAnim,
      0.03
    );


    this.animationAction.paused = false;
    this.animationMixer.setTime(
      this.animationClip.duration * this.currentProgressAnim
    );
    this.animationAction.paused = true;
    this.animationMixer.update(this.webgl.ticker.delta);

    // Set position
    this.posTarget = this.refCam.position;
    this.webgl.camera.position.set(
      this.posTarget.x,
      this.posTarget.y,
      this.posTarget.z
    );

    // Set rotation
    this.rotTarget = this.refCam.rotation;
    this.webgl.camera.setRotationFromEuler(this.rotTarget);
  }

  onPointerMove(e){
    if(!this.keyframes && this.keyframes.length == 0 || this.webgl.currentScene != this.idScene) return;

    const movementX = e.webgl.x;
    const movementY = e.webgl.y;

    this.offsetRot.x = movementX;
    this.offsetRot.y = movementY;
    this.offsetRot.z = 0;
  }

  onChangeScene(){
    this.currentKeyfame = 0
  }

  changeStep(e){
    if(e) { this.currentKeyfame = e; return }
    this.currentKeyfame = (this.currentKeyfame + 1) % this.keyframes.length
  }
}