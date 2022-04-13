import config from '../config.js';
import { createImage, useCanvas } from '../helpers.js';

const { canvas, ctx } = useCanvas();

export class Tileset {
  constructor({ position, element }) {
    this.position = position;
    this.mapPosition = 0;
    this.image = createImage('./assets/tileset.png');

    let amount = 0;
    let x = 0;
    let y = 0;

    if (element === 'ground') {
      amount = 3;
      x = 5;
      y = 7;
    }

    this.block = {
      amount,
      x,
      y,
    };

    this.width = 50 * this.block.amount;
    this.height = 50;
    this.position.y -= this.height;
  }

  draw() {
    ctx.drawImage(
      this.image,
      24 * this.block.x,
      24 * this.block.y,
      24 * this.block.amount,
      24,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
  }

  update({ keys, playerPositionX, isPlayerAttacking, mapSize }) {
    if (
      this.mapPosition < mapSize - canvas.width &&
      keys.d.pressed &&
      playerPositionX >= canvas.width / 2 &&
      !isPlayerAttacking
    ) {
      // Player moving to right
      this.mapPosition += config.player.velocity.x;
      this.position.x -= config.player.velocity.x;
    } else if (
      this.mapPosition > 0 &&
      keys.a.pressed &&
      playerPositionX < 50 &&
      !isPlayerAttacking
    ) {
      // Player moving to left
      this.mapPosition -= config.player.velocity.x;
      this.position.x += config.player.velocity.x;
    }

    this.draw();
  }
}
