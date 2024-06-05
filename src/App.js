// import { createDebugModules } from '@Debug/index.js';
// import { DEBUG, INSTALL } from '@Utils/config.js';
import { AssetsManager } from './utils/core/AssetsManager';
import { Ticker } from './utils/core/Ticker';
import { AudioManager } from './utils/core/audio/AudioManager';
import { Viewport } from './utils/tools/Viewport';
import { Mouse } from './utils/tools/Mouse';
import { Keyboard } from './utils/tools/Keyboard';
import { Scroll } from './utils/tools/Scroll';
import { state } from './utils/State';
import { EVENTS } from './utils/constants/events';
import WebglController from './webgl/WebglController';
import UIWebglController from './webgl/UIWebglController';
import HandleScenes from './utils/tools/HandleScenes';
import { URLParams } from './utils/tools/URLParams';

class App {
	/** @type App */
	static instance;

	async init() {
		this.webglContainer = document.getElementById('webgl-app');
		this.uiWebglContainer = document.getElementById('ui-webgl-app');

    // Core
    this.assetsManager = new AssetsManager();
    this.ticker = new Ticker();
    this.audio = new AudioManager();
    this.url = new URLParams();

    // Tools
    this.viewport = new Viewport(this.webglContainer);
    this.mouse = new Mouse(this.viewport);
    this.keyboard = new Keyboard();
    this.scroll = new Scroll(this.viewport);

    this.webgl = new WebglController(this.webglContainer);
    this.uiWebgl = new UIWebglController(this.uiWebglContainer);

    this.sceneshandler = new HandleScenes();

		window.addEventListener('click', this.handleFirstClick);

		// if (DEBUG) this.debug = await createDebugModules();

		await this.load();
	}

	async load() {
		await this.assetsManager.load();
		state.emit(EVENTS.ATTACH);
		state.emit(EVENTS.RESIZE, this.viewport.infos);
	}

	handleFirstClick = () => {
		window.removeEventListener('click', this.handleFirstClick);
		state.emit(EVENTS.FIRST_CLICK);
	};

	static getInstance() {
		if (!App.instance) App.instance = new App();
		return App.instance;
	}
}
const app = App.getInstance();
export { app };
