import { gsap } from "gsap"

import { IntroTextMaterial } from "@/webgl/Materials/IntroText/material"
import { Text } from "troika-three-text"

export default class IntroText extends Text {
  constructor() {
    super()

    this.isAnimated = false
    this.animationProgress = 0
    this.material = this.#createMaterial()
  }

  setText(text) {
    this.text = text
  }

  animateText(text) {
    this.isAnimated = true
    this.animationProgress = 0

    // [WIP] gérer plusieurs animateText en même temps

    gsap.to(this, {
      animationProgress: 0.5,
      duration: 0.5,
      onUpdate: () => {
        this.onAnimationProgress()
      },
      onComplete: () => {
        this.resetAnimation()
      },
      onRepeat: () => {
        this.text = text
      },
      yoyo: true,
      repeat: 1,
    })
  }

  onAnimationProgress() {
    // this.material.uniforms.uTime.value = this.animationProgress
  }

  resetAnimation() {
    this.isAnimated = false
    this.animationProgress = 0
  }

  #createMaterial() {
    const material = new IntroTextMaterial({
      uniforms: {
        uTime: { value: this.animationProgress },
      },
    })

    return material
  }
}
