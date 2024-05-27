import { state } from '../State';

class Scroll {
    constructor(viewport){
        state.register(this);

        this.viewport = viewport;
    }

    onAttach() {
		this.scrollValue = 0;
		this.scrollTarget = 0;

		window.addEventListener('scroll', this.#onScroll);
	}

    #onScroll(e){
        // console.log(e);
    }
}

export { Scroll };