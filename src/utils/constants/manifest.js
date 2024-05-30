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
    ladies: { path: `assets/models/ladies.glb` },
    dam: { path: `assets/models/dam.glb` },
    bridge: { path: `assets/models/bridge.glb` },
    chapel: { path: `assets/models/chapel.glb` },
    rock: { path: `assets/models/rock.glb` },
    milo: { path: `assets/models/milo.glb` },
    rocks: { path: `assets/models/rocks.glb`}
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