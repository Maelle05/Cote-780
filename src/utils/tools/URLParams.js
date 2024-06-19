const PARAMS_LIST = ['scene', 'debug', 'bzh', 'pres'];

class URLParams {
	params = new Map();

	constructor() {
		this.searchParams = new URLSearchParams(window.location.search);

		for (const param of PARAMS_LIST) {
			this.params.set(param, this.searchParams.get(param));
		}
	}

	get(name) {
		const param = this.params.get(name);

		if (this.has(name) === false) {
			return null;
		} else if (param === "") {
			return true;
		} else if ((+param).toString() !== "NaN") {
			return +this.params.get(name);
		} else if (param === "true" || param === "false") {
			return param === "true";
		} else {
			return param;
		}
	}

	has(name) {
		return this.params.get(name) !== null;
	}
}

export { URLParams };
