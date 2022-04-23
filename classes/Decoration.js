import { createImage, useCanvas } from '../helpers.js';
import config from '../config.js';

const { ctx } = useCanvas();

export class Decoration {
  constructor({ position, image, size }) {
    this.position = position;
    this.width = size;
    this.height = size;

    this.images = {
      shop: {
        image: createImage('./assets/decorations/shop_anim.png'),
        frameAmount: 6,
        hold: 10,
        x: 0,
        y: 0,
        w: 118,
        h: 128,
      },
      lamp: {
        image: createImage('./assets/decorations/lamp.png'),
        frameAmount: 1,
        hold: 10,
        x: 0,
        y: 0,
        w: 57,
        h: 57,
      },
      sign: {
        image: createImage('./assets/decorations/sign.png'),
        frameAmount: 1,
        hold: 10,
        x: 0,
        y: 0,
        w: 31,
        h: 31,
      },
      fence1: {
        image: createImage('./assets/decorations/fence_1.png'),
        frameAmount: 1,
        hold: 10,
        x: 0,
        y: -54,
        w: 73,
        h: 73,
      },
      rock1: {
        image: createImage('./assets/decorations/rock_1.png'),
        frameAmount: 1,
        hold: 10,
        x: 0,
        y: -9,
        w: 20,
        h: 20,
      },
      rock2: {
        image: createImage('./assets/decorations/rock_2.png'),
        frameAmount: 1,
        hold: 10,
        x: 0,
        y: -15,
        w: 27,
        h: 27,
      },
      rock3: {
        image: createImage('./assets/decorations/rock_3.png'),
        frameAmount: 1,
        hold: 10,
        x: 0,
        y: -27,
        w: 45,
        h: 45,
      },
    };

    this.frame = {
      current: 0,
      x: this.images[image].x,
      y: this.images[image].y,
      w: this.images[image].w,
      h: this.images[image].h,
      amount: this.images[image].frameAmount,
      image: this.images[image].image,
      hold: this.images[image].hold,
    };
  }

  draw() {
    ctx.drawImage(
      this.frame.image,
      this.frame.x + this.frame.w * this.frame.current + 0.5,
      this.frame.y,
      this.frame.w - 1,
      this.frame.h,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
  }

  update({ animationId, mapMovingLeft, mapMovingRight }) {
    if (mapMovingLeft) {
      this.position.x += config.player.velocity.x;
    } else if (mapMovingRight) {
      this.position.x -= config.player.velocity.x;
    }

    if (animationId % this.frame.hold === 0) this.frame.current++;
    if (this.frame.current >= this.frame.amount) this.frame.current = 0;
    this.draw();
  }
}
