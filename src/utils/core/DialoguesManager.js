import { state } from "../State";
import { ref } from "vue";

class DialoguesManager {
  static instance = null;

  constructor() {
    if (DialoguesManager.instance) {
      return DialoguesManager.instance;
    }

    state.register(this);
    this.textIndex = ref(1);
    this.personIndex = ref(1);
    this.sceneIndex = ref(0);

    this.hidden = ref(true);

    DialoguesManager.instance = this;
  }

  static getInstance() {
    if (!DialoguesManager.instance) {
      DialoguesManager.instance = new DialoguesManager();
    }
    return DialoguesManager.instance;
  }

  nextText() {
    this.textIndex.value += 1;
  }

  nextPerson() {
    this.personIndex.value += 1;
  }

  toggle() {
    this.hidden.value = !this.hidden.value;
  }

  onChangeScene() {
    this.textIndex.value = 1;
    this.personIndex.value = 1;
  }
}

export { DialoguesManager };
