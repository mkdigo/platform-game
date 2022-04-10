import { useCanvas } from '../helpers.js';

const { canvas, ctx } = useCanvas();

export class Background {
  constructor({ velocity, image }) {
    this.velocity = velocity;
    this.width = canvas.width;
    this.height = canvas.height;
    this.bg1 = {
      position: {
        x: -this.width,
        y: 0,
      },
    };
    this.bg2 = {
      position: {
        x: 0,
        y: 0,
      },
    };
    this.bg3 = {
      position: {
        x: this.width,
        y: 0,
      },
    };
    this.image = image;
  }

  draw() {
    ctx.drawImage(
      this.image,
      this.bg1.position.x,
      this.bg1.position.y,
      this.width,
      this.height
    );
    ctx.drawImage(
      this.image,
      this.bg2.position.x,
      this.bg2.position.y,
      this.width,
      this.height
    );
    ctx.drawImage(
      this.image,
      this.bg3.position.x,
      this.bg3.position.y,
      this.width,
      this.height
    );
  }

  update({ keys, playerPositionX }) {
    // 3 for remove the gap
    if (this.bg1.position.x < -this.width * 2)
      this.bg1.position.x = this.width - 3;
    if (this.bg2.position.x < -this.width * 2)
      this.bg2.position.x = this.width - 3;
    if (this.bg3.position.x < -this.width * 2)
      this.bg3.position.x = this.width - 3;

    if (this.bg1.position.x > this.width * 2)
      this.bg1.position.x = -this.width + 3;
    if (this.bg2.position.x > this.width * 2)
      this.bg2.position.x = -this.width + 3;
    if (this.bg3.position.x > this.width * 2)
      this.bg3.position.x = -this.width + 3;

    if (keys.d.pressed && playerPositionX >= canvas.width / 2) {
      this.bg1.position.x -= this.velocity.x;
      this.bg2.position.x -= this.velocity.x;
      this.bg3.position.x -= this.velocity.x;
    } else if (keys.a.pressed && playerPositionX < 50) {
      this.bg1.position.x += this.velocity.x;
      this.bg2.position.x += this.velocity.x;
      this.bg3.position.x += this.velocity.x;
    }

    this.draw();
  }
}
