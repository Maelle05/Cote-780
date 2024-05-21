import { state } from '../State.js';
import { AudioLoader, Cache } from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
import { EVENTS } from '../../Constants/events.js';
import { manifest } from '../../Constants/manifest.js';
import { AssetsLoader } from './AssetsLoader.js';
import { AjaxImageLoader } from './CustomLoaders/AjaxImageLoader.js';
import { AjaxJSONLoader } from './CustomLoaders/AjaxJSONLoader.js';
import { AjaxTextureLoader } from './CustomLoaders/AjaxTextureLoader.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
// import { TextureLoader } from 'three'

Cache.enabled = true;

class AssetsManager {
	#assetsInfos = new Map();
	#loadedAssets = new Map();
	#progress = 0;
	constructor({ blockingLoad = true, withPriority = false, withCriticals = false, isMobile = false } = {}) {
		this.blockingLoad = blockingLoad;
		this.withPriority = withPriority;
		this.withCriticals = withCriticals;
		this.isMobile = isMobile;

		const gltfLoader = new GLTFLoader();
		// const dracoLoader = new DRACOLoader()
		// dracoLoader.setDecoderPath( "/draco/" );
		// dracoLoader.preload()
		// gltfLoader.setDRACOLoader(dracoLoader)

		this.loaders = {
			images: new AssetsLoader({
				manifest: manifest.images,
				isMobile: this.isMobile,
				loader: new AjaxImageLoader(),
				assetsInfos: this.#assetsInfos,
				loadedAssets: this.#loadedAssets,
				progressCallback: this.#loadingProgress,
			}),

			textures: new AssetsLoader({
				manifest: manifest.textures,
				isMobile: this.isMobile,
				loader: new AjaxTextureLoader(),
				assetsInfos: this.#assetsInfos,
				loadedAssets: this.#loadedAssets,
				progressCallback: this.#loadingProgress,
			}),

			envMaps: new AssetsLoader({
				manifest: manifest.envMaps,
				isMobile: this.isMobile,
				loader: new RGBELoader(),
				assetsInfos: this.#assetsInfos,
				loadedAssets: this.#loadedAssets,
				progressCallback: this.#loadingProgress,
			}),

			models: new AssetsLoader({
				manifest: manifest.models,
				isMobile: this.isMobile,
				loader: gltfLoader,
				assetsInfos: this.#assetsInfos,
				loadedAssets: this.#loadedAssets,
				progressCallback: this.#loadingProgress,
				afterLoadCallback: (asset) => {
					asset.scene.animations = asset.animations;
					return asset.scene;
				},
			}),

			jsons: new AssetsLoader({
				manifest: manifest.jsons,
				isMobile: this.isMobile,
				loader: new AjaxJSONLoader(),
				assetsInfos: this.#assetsInfos,
				loadedAssets: this.#loadedAssets,
				progressCallback: this.#loadingProgress,
			}),

			sounds: new AssetsLoader({
				manifest: manifest.sounds,
				loader: new AudioLoader(),
				assetsInfos: this.#assetsInfos,
				loadedAssets: this.#loadedAssets,
				progressCallback: this.#loadingProgress,
			}),

			fonts : new AssetsLoader({
				manifest: manifest.fonts,
				isMobile: this.isMobile,
				loader: new FontLoader(),
				assetsInfos: this.#assetsInfos,
				loadedAssets: this.#loadedAssets,
				progressCallback: this.#loadingProgress,
			})
		};
	}

	async load() {
		if (this.withCriticals) await this.#loadCriticals();

		if (this.blockingLoad) await this.#loadAll();
		else if (this.withPriority) this.#loadInOrder();
		else this.#loadAll();
	}

	#loadAll() {
		return Promise.all(Object.values(this.loaders).map((loader) => loader.loadAssets()));
	}

	#loadCriticals() {
		return Promise.all(Object.values(this.loaders).map((loader) => loader.loadCriticalAssets()));
	}

	#loadInOrder() {
		return Promise.all(
			Object.values(this.loaders)
				.map((loader) => [...loader.assetsToLoad.entries()].map(([key, value]) => ({ loader, key, priority: value.priority || 0 })))
				.flat()
				.sort((a, b) => a.priority - b.priority)
				.map(({ loader, key }) => loader.loadAsset(key)),
		);
	}

	#loadingProgress = () => {
		this.#progress =
			[...this.#assetsInfos.values()].map((assetInfos) => assetInfos.progress).reduce((previousValue, currentValue) => previousValue + currentValue, 0) / this.#assetsInfos.size;
		state.emit(EVENTS.LOADER_PROGRESS, this.#progress);
	};

	get(...keys) {
		if (keys.length > 1) return keys.map((key) => this.#loadedAssets.get(key));
		else return this.#loadedAssets.get(keys[0]);
	}

	assetsLoaded(){
		return this.#loadedAssets
	}
}

export { AssetsManager };