import { createImage, useCanvas } from '../helpers.js';
import config from '../config.js';

const { ctx, canvas } = useCanvas();

export class Enemy {
  constructor({ position, width, height, image }) {
    this.position = position;
    this.width = width;
    this.height = height;
    this.image = image;
    this.velocity = {
      x: 3,
      y: 0,
    };
    this.images = {
      goblin: {
        frame: {
          x: 57,
          y: 66,
          w: 35,
          h: 35,
        },
        idle: {
          image: createImage('./assets/enemies/goblin/idle.png'),
          amount: 4,
        },
        attack: {
          image: createImage('./assets/enemies/goblin/attack.png'),
          amount: 8,
        },
        takeHit: {
          image: createImage('./assets/enemies/goblin/takeHit.png'),
          amount: 4,
        },
        death: {
          image: createImage('./assets/enemies/goblin/death.png'),
          amount: 4,
        },
      },
      flyingEye: {
        frame: {
          x: 57,
          y: 58,
          w: 42,
          h: 42,
        },
        idle: {
          image: createImage('./assets/enemies/flyingEye/idle.png'),
          amount: 4,
        },
        attack: {
          image: createImage('./assets/enemies/flyingEye/attack.png'),
          amount: 8,
        },
        takeHit: {
          image: createImage('./assets/enemies/flyingEye/takeHit.png'),
          amount: 4,
        },
        death: {
          image: createImage('./assets/enemies/flyingEye/death.png'),
          amount: 4,
        },
      },
      mushroom: {
        frame: {
          x: 57,
          y: 64,
          w: 38,
          h: 38,
        },
        idle: {
          image: createImage('./assets/enemies/mushroom/idle.png'),
          amount: 4,
        },
        attack: {
          image: createImage('./assets/enemies/mushroom/attack.png'),
          amount: 8,
        },
        takeHit: {
          image: createImage('./assets/enemies/mushroom/takeHit.png'),
          amount: 4,
        },
        death: {
          image: createImage('./assets/enemies/mushroom/death.png'),
          amount: 4,
        },
      },
      skeleton: {
        frame: {
          x: 53,
          y: 48,
          w: 53,
          h: 53,
        },
        idle: {
          image: createImage('./assets/enemies/skeleton/idle.png'),
          amount: 4,
        },
        attack: {
          image: createImage('./assets/enemies/skeleton/attack.png'),
          amount: 8,
        },
        takeHit: {
          image: createImage('./assets/enemies/skeleton/takeHit.png'),
          amount: 4,
        },
        death: {
          image: createImage('./assets/enemies/skeleton/death.png'),
          amount: 4,
        },
      },
    };
    this.frame = {
      current: 0,
      x: this.images[this.image].frame.x,
      y: this.images[this.image].frame.y,
      w: this.images[this.image].frame.w,
      h: this.images[this.image].frame.h,
      image: this.images[this.image].idle.image,
      amount: this.images[this.image].idle.amount,
    };
    this.flipImage = true;
  }

  draw() {
    // ctx.fillRect(this.position.x, this.position.y, this.width, this.height);

    ctx.save();
    if (this.flipImage) ctx.scale(-1, 1);
    ctx.drawImage(
      this.frame.image,
      this.frame.x + 150 * this.frame.current,
      this.frame.y,
      this.frame.w,
      this.frame.h,
      this.flipImage ? -this.position.x - this.width : this.position.x,
      this.position.y,
      this.width,
      this.height
    );
    ctx.restore();
  }

  update({ animationId }) {
    if (animationId % 9 === 0) this.frame.current++;
    if (this.frame.current >= this.frame.amount) this.frame.current = 0;

    this.draw();
  }
}
