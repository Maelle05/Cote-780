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

    this.posTarget = new Vector3(0, 0, 0);
    this.orbitEuler = new Euler(0, 0, 0, 'YXZ');
    this.orbitEulerTarget = {
      x: this.orbitEuler.x,
      y: this.orbitEuler.y,
    };
    this.rotTarget = new Euler(0, 0, 0, 'YXZ');
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
    this.posTarget.copy(this.refCam.position)
    app.webgl.camera.position.copy(this.posTarget)

    // Set rotation
    // this.rotTarget.copy(this.refCam.rotation);
    // app.webgl.camera.setRotationFromEuler(this.rotTarget);

    // smooth orbit
    // this.orbitEuler.y = MathUtils.lerp(
    //   this.orbitEuler.y,
    //   this.orbitEulerTarget.y,
    //   0.1
    // );
    // this.orbitEuler.x = MathUtils.lerp(
    //   this.orbitEuler.x,
    //   this.orbitEulerTarget.x,
    //   0.1
    // );
    // anim rot + orbit rot
    this.rotTarget.copy(this.refCam.rotation)
    const rotResult = this.sumTowEuler(this.rotTarget, this.orbitEuler);

    app.webgl.camera.rotation.order = 'YXZ';
    app.webgl.camera.setRotationFromEuler(rotResult);

  }

  onPointerMove(e){
    if(app.webgl.currentScene != this.idScene) return;
    const rotationSpeed = 0.01;
    this.orbitEuler.y = MathUtils.lerp(this.orbitEuler.y,  - e.webgl.x * rotationSpeed, 0.1);
    this.orbitEuler.x = MathUtils.lerp(this.orbitEuler.x, e.webgl.y * rotationSpeed, 0.1);

    this.orbitEulerTarget.x = this.orbitEuler.x;
    this.orbitEulerTarget.y = this.orbitEuler.y;
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

  sumTowEuler(rotOne, rotTwo) {
    const resultEuler = new Euler(0, 0, 0, 'YXZ');

    const one = new Quaternion();
    one.setFromEuler(rotOne);
    const tow = new Quaternion();
    tow.setFromEuler(rotTwo);

    const resultQuaternion = new Quaternion();
    resultQuaternion.multiplyQuaternions(one, tow);

    resultEuler.setFromQuaternion(resultQuaternion, 'YXZ');
    return resultEuler;
  }
}