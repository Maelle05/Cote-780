import { IntroTextMaterial } from "@/webgl/Materials/IntroText/material";
import { Text } from "troika-three-text"

export default class IntroText extends Text {
    constructor() {
      super();

      this.material = this.#createMaterial();
    }

    updateText(text) {
        console.log('IntroText.js - updateText() ', text)
        this.text = text
    }
  
    onAttach() {
      console.log("intro text!")
    }

    #createMaterial(){
        const material = new IntroTextMaterial({
                uniforms: {
                    uTime: { value: 0 },
                }
        })
    
        return material
      }
  }