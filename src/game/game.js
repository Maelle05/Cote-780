import gsap from "gsap";

export default class Game {
  constructor(container) {
    this.circles = Array.from(container.children);

    // Sizes
    this.sizes = {
      width: 500,
      height: 500,
    };

    window.addEventListener("resize", this.resize);

    this.spawn(this.circles[1]);

    for (const circle of this.circles) {
      // circle.clicked = false;
      circle.addEventListener("click", (e) => {
        this.clicked(e.target);
      });
    }

    // this.circles[1].addEventListener("onclick", (e) => {
    //   this.clicked(e.target);
    // });
  }

  clicked = (circle) => {
    this.despawn(circle);
    // circle.clicked = true;
  };

  despawn = (circle) => {
    gsap.killTweensOf(circle);

    gsap.to(circle, {
      opacity: 0,
      duration: 1,
    });

    const circleToSpawn = this.circles.filter((el) => el != circle);
    this.spawn(circleToSpawn[0]);
  };

  spawn = (circle) => {
    circle.style.left = this.random() + "px";
    circle.style.top = this.random() + "px";
    gsap.to(circle, {
      opacity: 1,
      duration: 2,
      onComplete: () => {
        this.despawn(circle);
      },
    });
  };

  resize = () => {
    // Update sizes
    this.sizes.width = window.innerWidth;
    this.sizes.height = window.innerHeight;
  };

  random = () => {
    const circleSize = 70;
    const min = 0 + circleSize;
    const max = 500 - circleSize;
    const random = Math.random() * (max - min) + min;
    return Math.round(random);
  };
}
