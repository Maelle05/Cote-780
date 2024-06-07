import { AnimationMixer, MathUtils, Euler, Quaternion, Vector3 } from "three";
import { state } from '../../utils/State';
import { app } from "@/App";
import { Vector2 } from "three";


export class CamAnim {
  constructor(idScene, scene, keyframes){
    state.register(this);

    this.idScene = idScene

    this.refCam = scene.children.find(el => el.name == "Camera")
    this.refCam.userData.name = 'Ref cam scene : ' + idScene
    this.baseFov = this.refCam.fov
    this.animationClip = scene.animations.find((el) => el.name == "CameraAction")
    this.keyframes = keyframes
    this.currentKeyfame = 0

    this.pos = new Vector3(0, 0, 0);
    this.posTarget = new Vector3(0, 0, 0);
    this.rotTarget = new Euler(0, 0, 0, 'YXZ');
    this.cursorOffset = new Vector2(0, 0);
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
      0.02
    );

    this.animationAction.paused = false;
    this.animationMixer.setTime(
      this.animationClip.duration * this.currentProgressAnim
    );
    this.animationAction.paused = true;
    this.animationMixer.update(app.ticker.delta);

    // Set position
    // this.pos.copy(this.refCam.position)
    this.posTarget.copy(this.refCam.position)
    // this.posTarget.x -= this.cursorOffset.x * 0.1;
    // this.posTarget.y += this.cursorOffset.y * 0.1;
    // this.pos.lerp(this.posTarget, 0.8 );
    // console.log(this.pos, this.posResult);
    app.webgl.camera.position.copy(this.posTarget)

    // Set rotation
    this.rotTarget.copy(this.refCam.rotation);
    app.webgl.camera.setRotationFromEuler(this.rotTarget);
  }

  onPointerMove(e){
    if(app.webgl.currentScene != this.idScene) return;
    this.cursorOffset.x = e.webgl.x;
    this.cursorOffset.y = e.webgl.y;
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
    app.webgl.camera.name = 'Cam'
    app.webgl.camera.uuid = ''
    const ratio = window.innerWidth / window.innerHeight
    app.webgl.camera.aspect = ratio;
    app.webgl.camera.fov = this.baseFov / Math.min(1, ratio * 1.5);
    app.webgl.camera.updateProjectionMatrix();
  }
}