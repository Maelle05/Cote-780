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
  },
  envMaps: {
    // envmap: { path: `/assets/textures/envmap.hdr` },
  },
  models: {
    map: { path: `assets/models/map.glb` },
    ladies_opti: { path: `assets/models/ladies_opti.glb` },
    ladies_vg_samples: { path: `assets/models/ladies_vg_samples.glb` },
    dam: { path: `assets/models/dam.glb` },
    bridge: { path: `assets/models/bridge.glb` },
    chapel: { path: `assets/models/chapel.glb` },
    village: { path: `assets/models/village.glb` },
    milo: { path: `assets/models/milo.glb` },
    milo_anim: { path: `assets/models/milo-anims.glb` },
    rocks: { path: `assets/models/rocks.glb` },
    end: { path: `assets/models/end.glb` },
  },
  jsons: {},
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
