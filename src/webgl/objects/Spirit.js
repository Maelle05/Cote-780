import { DoubleSide, Mesh, PlaneGeometry, RepeatWrapping } from "three";
import gsap from "gsap";
import { state } from "@/utils/State";
import { app } from "@/App";
import { SpiritFaceMaterial } from "../materials/Spirit/Face/material";
import { SpiritBodyMaterial } from "../materials/Spirit/Body/material";
import { Vector2 } from "three";
import { Group } from "three";
import { Vector3 } from "three";
import { Vector4 } from "three";

export default class Spirit extends Group {
  constructor() {
    super();
    state.register(this);
    this.name = "Spirit";

    const noise = app.assetsManager.get("spiritNoise");
    noise.wrapS = RepeatWrapping;
    noise.wrapT = RepeatWrapping;
    const tex = app.assetsManager.get("spiritTex");
    const texBody = app.assetsManager.get("spiritTexBody");
    this.currentSpiritColor = new Vector4(1, 1, 1, 1);
    this.targetSpiritColor = new Vector4(1, 1, 1, 1);

    // Face
    this.faceGeometry = new PlaneGeometry(0.25, 0.25);
    this.faceMaterial = new SpiritFaceMaterial({
      uniforms: {
        u_time: { value: 0 },
        u_move: { value: 0 },
        u_faceMask: { value: app.assetsManager.get("spiritFace") },
        u_texture: { value: tex },
        u_noise: { value: noise },
        u_color: { value: this.currentSpiritColor },
        u_gOpacity: { value: 1 },
      },
    });
    this.face = new Mesh(this.faceGeometry, this.faceMaterial);
    this.add(this.face);

    // Body
    this.bodyGeometry = new PlaneGeometry(0.25, 0.27);
    this.bodyMaterial = new SpiritBodyMaterial({
      uniforms: {
        u_time: { value: 0 },
        u_move: { value: 0 },
        u_faceMask: { value: app.assetsManager.get("spiritBody") },
        u_texture: { value: texBody },
        u_noise: { value: noise },
        u_color: { value: this.currentSpiritColor },
        u_gOpacity: { value: 1 },
      },
    });
    this.body = new Mesh(this.bodyGeometry, this.bodyMaterial);
    this.body.position.x = 0.01;
    this.body.position.y = -0.21;
    this.body.position.z = -0.01;
    this.add(this.body);

    // Arm 1
    this.armGeometry = new PlaneGeometry(0.1, 0.1);
    this.armMaterial = new SpiritBodyMaterial({
      uniforms: {
        u_time: { value: 0 },
        u_move: { value: 0 },
        u_faceMask: { value: app.assetsManager.get("spiritArm") },
        u_texture: { value: tex },
        u_noise: { value: noise },
        u_color: { value: this.currentSpiritColor },
        u_gOpacity: { value: 1 },
      },
    });
    this.armMaterial.side = DoubleSide;
    this.arm1 = new Mesh(this.armGeometry, this.armMaterial);
    this.arm1.position.x = 0.11;
    this.arm1.position.y = -0.16;
    this.arm1.position.z = 0.02;
    this.arm1.rotation.z = -30 * (Math.PI / 180);
    this.arm1Base = {
      posX: this.arm1.position.x,
      rotZ: this.arm1.rotation.z,
    };
    this.add(this.arm1);

    // Arm
    this.arm2 = new Mesh(this.armGeometry, this.armMaterial);
    this.arm2.position.x = -0.11;
    this.arm2.position.y = -0.16;
    this.arm2.position.z = 0.02;
    this.arm2.rotation.y = 180 * (Math.PI / 180);
    this.arm2.rotation.z = -30 * (Math.PI / 180);
    this.arm2Base = {
      posX: this.arm2.position.x,
      rotZ: this.arm2.rotation.z,
    };
    this.add(this.arm2);

    // Var
    this.lastPos = 0;

    this.scale.set(0.6, 0.6, 0.6);
  }

  show() {
    gsap.to(
      [
        this.body.material.uniforms.u_gOpacity,
        this.arm1.material.uniforms.u_gOpacity,
        this.face.material.uniforms.u_gOpacity,
      ],
      {
        value: 1,
        duration: 0.5,
      }
    );
  }

  hide() {
    gsap.to(
      [
        this.body.material.uniforms.u_gOpacity,
        this.arm1.material.uniforms.u_gOpacity,
        this.face.material.uniforms.u_gOpacity,
      ],
      {
        value: 0,
        duration: 0.5,
      }
    );
  }

  onTick() {
    this.lookAt(app.webgl.camera.position);

    if (this.faceMaterial) {
      const time = app.ticker.elapsed * 0.001;
      this.faceMaterial.uniforms.u_time.value = time;
      this.bodyMaterial.uniforms.u_time.value = time;
      this.armMaterial.uniforms.u_time.value = time;

      const move = this.valueMove(this.position.x);
      this.faceMaterial.uniforms.u_move.value = move;
      this.bodyMaterial.uniforms.u_move.value = move;

      const newColor = this.currentSpiritColor.lerp(
        this.targetSpiritColor,
        0.5
      );
      this.faceMaterial.uniforms.u_color.value = newColor;
      this.bodyMaterial.uniforms.u_color.value = newColor;
      this.currentSpiritColor = newColor;

      this.arm1.rotation.z = this.arm1Base.rotZ + move * 30 * (Math.PI / 180);
      this.arm2.rotation.z = this.arm2Base.rotZ + move * 30 * (Math.PI / 180);

      this.position.y += Math.sin(time) * 0.0005;
    }
  }

  valueMove(currentPos) {
    let strength = 0;
    if (currentPos != this.lastPos) {
      const diff = (currentPos - this.lastPos) * 20;
      strength = diff > 1 ? 1 : diff < -1 ? -1 : diff;
      strength = -strength;
      this.lastPos = currentPos;
    } else {
      strength = Math.sin(app.ticker.elapsed * 0.001) * 0.3;
    }

    return strength; // entre -1 et 1
  }
}
