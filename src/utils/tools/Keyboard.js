import { state } from '../State';
import { EVENTS } from '../constants/events';

class Keyboard {
	constructor() {
		state.register(this);
	}

	onAttach() {
		document.addEventListener('keydown', this.#keyDown);
	}

	#keyDown = (e) => {
		state.emit(EVENTS.KEY_DOWN, e.key);
	};
}

export { Keyboard };