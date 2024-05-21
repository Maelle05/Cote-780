import { state } from '../State';
import { EVENTS } from '../../Constants/events';

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