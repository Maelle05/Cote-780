class AssetsLoader {
	constructor({
		manifest = {},
		loader = null,
		isMobile = false,
		assetsInfos = new Map(),
		loadedAssets = new Map(),
		progressCallback = () => null,
		afterLoadCallback = (asset) => asset,
	} = {}) {
		this.manifest = manifest;
		this.loader = loader;
		this.isMobile = isMobile;

		this.assetsToLoad = new Map();
		this.assetsInfos = assetsInfos;

		this.loadedAssets = loadedAssets;
		this.progressCallback = progressCallback;
		this.afterLoadCallback = afterLoadCallback;

		this.add(...Object.keys(manifest));
	}

	add(...keys) {
		for (const key of keys) if (!this.assetsToLoad.has(key) && this.manifest[key]) this.assetsToLoad.set(key, this.manifest[key]);
	}

	getAsset(key) {
		return this.loadedAssets.get(key);
	}

	getAssets(...keys) {
		return Object.fromEntries(keys ? [...this.loadedAssets.entries()].filter(([key]) => keys.includes(key)) : this.loadedAssets.entries());
	}

	async loadAsset(key) {
		if (this.loadedAssets.has(key)) return this.loadedAssets.get(key);
		else {
			try {
				const path = this.isMobile && this.manifest[key].pathMobile ? this.manifest[key].pathMobile : this.manifest[key].path;
				const asset = this.afterLoadCallback(await this.loader.loadAsync(path, (e) => this.assetProgress(e, key)));
				this.loadedAssets.set(key, asset?.scene?.isObject3D ? asset.scene : asset);
				this.manifest[key].callbacks?.forEach((cb) => cb(this.loadedAssets.get(key)));
				return asset;
			} catch (err) {
				console.log(err);
				return;
			}
		}
	}

	loadAssets() {
		return Promise.all([...this.assetsToLoad.keys()].map((key) => this.loadAsset(key)));
	}

	loadCriticalAssets() {
		return Promise.all([...this.assetsToLoad.keys()].map((key) => this.manifest[key].critical && this.loadAsset(key)));
	}

	assetProgress(e, key) {
		const total = e.total > 0 ? e.total : this.manifest[key].size;
		// console.log(total);

		if (!total) return;

		if (!this.assetsInfos.has(key)) this.assetsInfos.set(key, { size: total, progress: 0 });
		const assetInfos = this.assetsInfos.get(key);

		// Make sure the progress doesn't exceed 100%
		const progress = Math.min(e.loaded / assetInfos.size, 1);

		assetInfos.progress = progress;
		this.progressCallback?.();
	}
}

export { AssetsLoader };