import { useCanvas } from '../helpers.js';
import config from '../config.js';

const { ctx } = useCanvas();

export class Emblem {
  constructor({ position, image, scale, fixedPositionY }) {
    if (!scale) scale = 1;

    this.position = position;
    this.isFixed = false;
    this.fixedPosition = {
      x: 0,
      y: fixedPositionY ? fixedPositionY : 20,
    };
    this.image = image;
    this.width = 56 * scale;
    this.height = 56 * scale;
  }

  get(positionX) {
    this.isFixed = true;
    this.fixedPosition.x = positionX;
  }

  draw() {
    ctx.drawImage(
      this.image,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
  }

  update({ mapMovingLeft, mapMovingRight }) {
    if (mapMovingRight && !this.isFixed) {
      // Player moving to right
      this.position.x -= config.player.velocity.x;
    } else if (mapMovingLeft && !this.isFixed) {
      // Player moving to left
      this.position.x += config.player.velocity.x;
    }

    if (this.isFixed) {
      if (this.position.y > this.fixedPosition.y) this.position.y -= 8;
      else this.position.y = this.fixedPosition.y;

      if (this.position.x > this.fixedPosition.x) this.position.x -= 8;
      else this.position.x = this.fixedPosition.x;
    }

    this.draw();
  }
}
