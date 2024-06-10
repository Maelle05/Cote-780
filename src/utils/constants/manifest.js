/* 
This file is used to list and load the assets you need. To configure the behavior of the loader you can edit the AssetsManager file.

You can set a priority to your asset to reorder the loading process.

You can add a callback to any of the manifest items anywhere in your code (obviously before the asset is loaded). 
This is usefull if you desactivate the blocking behavior of the loader.

Finally, you can set some item to be criticals if you want your to wait the loading of some assets before initializing the app.
*/

const manifest = {
  images: {},
  textures: {
    matcap: { path: `/assets/textures/matcap.png` },
    spiritFace: { path: `/assets/textures/Spirit/spirit-face.png` },
    spiritBody: { path: `/assets/textures/Spirit/spirit-body.png` },
    spiritArm: { path: `/assets/textures/Spirit/spirit-arm.png` },
    spiritTex: { path: `/assets/textures/Spirit/spirit-tex.png` },
    spiritTexBody: { path: `/assets/textures/Spirit/spirit-body-tex.png` },
    spiritNoise: {
      path: `/assets/textures/Noise/Super Perlin/SuperPerlin_02-256x256.png`,
    },
    doorTexture: { path: `/assets/textures/DoorTexture.jpg` },
    doorNoise: {
      path: `/assets/textures/Noise/Swirl/Swirl_01-256x256.png`,
    },
    explosion1: {
      path: `/assets/textures/spritesheets/explosion1/explosion1.png`,
    },
    explosion2: {
      path: `/assets/textures/spritesheets/explosion2/explosion2.png`,
    },
    explosion3: {
      path: `/assets/textures/spritesheets/explosion3/explosion3.png`,
    },
    explosion4: {
      path: `/assets/textures/spritesheets/explosion4/explosion4.png`,
    },
    explosion5: {
      path: `/assets/textures/spritesheets/explosion5/explosion5.png`,
    },
    explosion6: {
      path: `/assets/textures/spritesheets/explosion6/explosion6.png`,
    },
    flamme: { path: `/assets/textures/flamme.png` },
  },
  envMaps: {
    // envmap: { path: `/assets/textures/envmap.hdr` },
  },
  models: {
    map: { path: `assets/models/map.glb` },
    ladies: { path: `assets/models/ladies.glb` },
    ladies_vg_samples: { path: `assets/models/ladies_vg_samples.glb` },
    dam: { path: `assets/models/dam.glb` },
    bridge: { path: `assets/models/bridge.glb` },
    chapel: { path: `assets/models/chapel.glb` },
    village: { path: `assets/models/village.glb` },
    milo: { path: `assets/models/milo.glb` },
    milo_anim: { path: `assets/models/milo-anims.glb` },
    durance: { path: `/assets/models/durance.glb` },
    rocks: { path: `assets/models/rocks.glb` },
    end: { path: `assets/models/end-anim.glb` },
  },
  jsons: {
    explosion1_data: {
      path: `/assets/textures/spritesheets/explosion1/explosion1.json`,
    },
    explosion2_data: {
      path: `/assets/textures/spritesheets/explosion2/explosion2.json`,
    },
    explosion3_data: {
      path: `/assets/textures/spritesheets/explosion3/explosion3.json`,
    },
    explosion4_data: {
      path: `/assets/textures/spritesheets/explosion4/explosion4.json`,
    },
    explosion5_data: {
      path: `/assets/textures/spritesheets/explosion5/explosion5.json`,
    },
    explosion6_data: {
      path: `/assets/textures/spritesheets/explosion6/explosion6.json`,
    },
  },
  sounds: {
    // playerRotation: { path: `/assets/sounds/player_rotation.mp3`, params: { volume: 0.05 } },
  },
  fonts: {
    // helvetikerRegular: {
    //   path: `/assets/fonts/helvetiker_regular.typeface.json`,
    // },
  },
};

export { manifest };
