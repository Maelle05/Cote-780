import { app } from "@/App";
import { Group, InstancedMesh, Vector3 } from "three";

export default class Vegetation extends Group {
  constructor(sceneId, scale = 1) {
    super();
    this.scaleVector = new Vector3(scale, scale, scale);

    this.empties = new Map(); // Map of empties representing the position, scale and rotation of the vegetation
    this.samples = new Map(); // Map of samples representing the mesh of each different vegetation type
    this.meshes = new Map(); // Map of all meshes instanced and placed in the scene

    this.scene = app.assetsManager.get(sceneId);
    this.scene.traverse((el) => {
      if (el.name.startsWith("VG-")) {
        const id = el.name.split("-")[1].split("0")[0];
        if (this.empties.has(id)) {
          this.empties.get(id).push(el);
        } else {
          this.empties.set(id, [el]);
        }
      }
    });

    this.sampleScene = app.assetsManager.get("vegetation");
    this.sampleScene.traverse((el) => {
      if (el.name.startsWith("VG-")) {
        const id = el.name.split("-")[1].split("0")[0];
        this.samples.set(id, el);

        if (!this.empties.has(id)) return;

        const instancedMesh = new InstancedMesh(el.geometry, el.material, this.empties.get(id).length);
        this.meshes.set(id, instancedMesh);
      }
    });

    this.empties.forEach((empties, id) => {
      const instancedMesh = this.meshes.get(id);

      if (!instancedMesh) {
        console.warn(`No sample found for vegetation id ${id}`);
        return;
      }

      empties.forEach((empty, i) => {
        empty.matrix.scale(this.scaleVector);
        instancedMesh.setMatrixAt(i, empty.matrix);
      });
      instancedMesh.instanceMatrix.needsUpdate = true;
      this.add(instancedMesh);
    });
  }
}
