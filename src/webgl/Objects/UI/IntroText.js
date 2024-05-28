import { gsap } from "gsap"

import { IntroTextMaterial } from "@/webgl/Materials/IntroText/material"
import { Text } from "troika-three-text"

export default class IntroText extends Text {
  constructor() {
    super()

    this.animationDuration = 1.4
    this.animationProgress = 0

    this.material = this.#createMaterial()
    this.anchorX = "left"
    this.anchorY = "bottom"
    this.fontStyle = "italic"
    this.textAlign = "left"
    this.position.x = -2.2
    this.position.y = -1
    this.maxWidth = 2
    this.fontSize = 0.08
    this.fontWeight = 800
  }

  setText(text) {
    this.text = text
    this.sync()
  }

  animateText(text) {
    this.currentText = text
    this.disappearAnimation()
  }

  disappearAnimation() {
    gsap.to(this, {
      animationProgress: 0.5,
      duration: this.animationDuration / 2,
      onUpdate: () => {
        this.onAnimationProgress()
      },
      onComplete: () => {
        this.setText(this.currentText)
        this.appearAnimation()
      },
    })
  }

  appearAnimation() {
    gsap.to(this, {
      animationProgress: 0,
      duration: this.animationDuration / 2,
      onUpdate: () => {
        this.onAnimationProgress()
      },
      onComplete: () => {
        this.resetAnimation()
      },
    })
  }

  onAnimationProgress() {
    this.material.uniforms.uTime.value = this.animationProgress * 2
  }

  resetAnimation() {
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
