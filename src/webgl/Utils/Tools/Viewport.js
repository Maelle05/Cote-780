import { state } from '../State';
import { EVENTS } from '../../Constants/events';

class Viewport {
	constructor(container) {
		state.register(this);

		this.container = container;

		const bbox = this.container.getBoundingClientRect();

		this.width = Math.min(window.innerWidth, bbox.width);
		this.height = bbox.height;

		this.#setConfig();
		this.#onWindowResize();

		this.isMobileAtLaunch = this.breakpoint === 'mobile';
	}

	onAttach() {
		const resizeObserver = new ResizeObserver(this.#onResize);
		resizeObserver.observe(this.container);

		window.addEventListener('resize', this.#onWindowResize);
	}

	get infos() {
		return { width: this.width, height: this.height, dpr: this.dpr, ratio: this.ratio, device: this.breakpoint };
	}

	#onWindowResize = () => {
		document.documentElement.style.setProperty('--vh', document.documentElement.clientHeight * 0.01 + 'px');
	};

	#onResize = (entries) => {
		if (entries[0].contentBoxSize) {
			const contentBoxSize = Array.isArray(entries[0].contentBoxSize) ? entries[0].contentBoxSize[0] : entries[0].contentBoxSize;
			this.width = contentBoxSize.inlineSize;
			this.height = contentBoxSize.blockSize;
		} else {
			this.width = entries[0].contentRect.width;
			this.height = entries[0].contentRect.height;
		}

		this.#setConfig();

		state.emit(EVENTS.RESIZE, this.infos);
	};

	#setConfig() {
		this.dpr = Math.min(1.5, window.devicePixelRatio);
		this.ratio = this.width / this.height;
	}
}

export { Viewport };