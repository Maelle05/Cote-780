import { AnimationMixer, MathUtils, Euler, Quaternion } from "three";
import { state } from '../../utils/State';
import { app } from "@/App";


export class CamAnim {
  constructor(idScene, scene, keyframes){
    state.register(this);

    this.idScene = idScene

    this.refCam = scene.children.find(el => el.name == "Camera")
    this.refCam.userData.name = 'Camera scene : ' + idScene
    this.baseFov = this.refCam.fov
    this.animationClip = scene.animations[0]
    this.keyframes = keyframes
    this.currentKeyfame = 0

    this.rotTarget = new Euler(0, 0, 0, 'YXZ');
    this.offsetRot = new Euler(0, 0, 0, 'YXZ');
    this.currentProgressAnim = 0;
    this.targetProgressAnim = 0;

    // Init anim
    this.animationMixer = new AnimationMixer(this.refCam);
    this.animationAction = this.animationMixer.clipAction(this.animationClip);
    this.animationAction.play();
    this.animationAction.paused = true;
  }

  onAttach(){
    if(app.webgl.currentScene != this.idScene) return;
    this.#changeCam()
  }

  onResize({ ratio }) {
    if(app.webgl.currentScene != this.idScene) return;
    app.webgl.camera.aspect = ratio;
    app.webgl.camera.fov = this.baseFov / Math.min(1, ratio * 1.5);
    app.webgl.camera.updateProjectionMatrix();
  }
  
  onTick(){
    if(!this.keyframes && this.keyframes.length == 0 || app.webgl.currentScene != this.idScene) return;

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
    this.animationMixer.update(app.ticker.delta);

    // Set position
    this.posTarget = this.refCam.position;
    app.webgl.camera.position.set(
      this.posTarget.x,
      this.posTarget.y,
      this.posTarget.z
    );

    // Set rotation
    this.rotTarget = this.refCam.rotation;
    app.webgl.camera.setRotationFromEuler(this.rotTarget);
  }

  onPointerMove(e){
    if(app.webgl.currentScene != this.idScene) return;

    const movementX = e.webgl.x;
    const movementY = e.webgl.y;

    this.offsetRot.x = movementX;
    this.offsetRot.y = movementY;
    this.offsetRot.z = 0;
  }

  onChangeScene(){
    if(app.webgl.currentScene != this.idScene) return;
    this.currentKeyfame = 0
    this.#changeCam()
  }

  onChangeSceneStep(e){
    if(app.webgl.currentScene != this.idScene) return;
    if(e) { this.currentKeyfame = e; return }
    this.currentKeyfame = (this.currentKeyfame + 1) % this.keyframes.length
  }

  #changeCam(){
    app.webgl.camera = this.refCam.clone()
    const ratio = window.innerWidth / window.innerHeight
    app.webgl.camera.aspect = ratio;
    app.webgl.camera.fov = this.baseFov / Math.min(1, ratio * 1.5);
    app.webgl.camera.updateProjectionMatrix();
  }
}