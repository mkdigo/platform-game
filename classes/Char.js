import { useCanvas } from '../helpers.js';

const { canvas, ctx } = useCanvas();
const gravity = 5;

export class Char {
  constructor({ position, width, height, image, frame }) {
    this.position = position;
    this.velocity = {
      x: 3,
      y: 5,
    };
    this.width = width;
    this.height = height;

    this.image = image;
    this.flipImage = false;
    this.frame = frame;
    this.frame.position = {
      x: 0,
      y: 0,
      amount: this.frame.idle.amount,
    };

    this.setHitBox();
  }

  setHitBox() {
    this.hitBox = {
      x: this.position.x + 35,
      y: this.position.y + 50,
      w: 40,
      h: 60,
    };
  }

  attack() {
    this.frame.position.y = this.frame.attack.y;
    this.frame.position.amount = this.frame.attack.amount;
  }

  run() {
    this.frame.position.y = this.frame.run.y;
    this.frame.position.amount = this.frame.run.amount;
  }

  move(direction) {
    switch (direction) {
      case 'right':
        this.flipImage = false;
        this.position.x += this.velocity.x;
        this.frame.position.y = this.frame.run.y;
        this.frame.position.amount = this.frame.run.amount;
        break;
      case 'left':
        this.flipImage = true;
        this.position.x -= this.velocity.x;
        this.frame.position.y = this.frame.run.y;
        this.frame.position.amount = this.frame.run.amount;
        break;
      default:
        this.frame.position.y = this.frame.idle.y;
        this.frame.position.amount = this.frame.idle.amount;
    }

    this.setHitBox();
  }

  draw() {
    ctx.fillStyle = '#033';
    ctx.fillRect(this.hitBox.x, this.hitBox.y, this.hitBox.w, this.hitBox.h);

    ctx.save();
    if (this.flipImage) ctx.scale(-1, 1);
    ctx.drawImage(
      this.image,
      this.frame.size.x * this.frame.position.x,
      this.frame.size.y * this.frame.position.y,
      this.frame.size.x,
      this.frame.size.y,
      this.flipImage ? -this.position.x - this.width : this.position.x,
      this.position.y,
      this.width,
      this.height
    );
    ctx.restore();
  }

  update({ animationId, keys }) {
    // Moviments
    if (keys.d.pressed) this.move('right');
    else if (keys.a.pressed) this.move('left');
    else this.move('stop');

    // Frames
    if (this.frame.position.x >= this.frame.position.amount)
      this.frame.position.x = 0;

    this.draw();
    if (animationId % 6 === 0) this.frame.position.x++;
  }
}
