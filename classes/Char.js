import config from '../config.js';
import { useCanvas } from '../helpers.js';

const { canvas, ctx } = useCanvas();

export class Char {
  constructor({ position, width, height, image, frame }) {
    this.position = position;
    this.velocity = {
      x: config.player.velocity.x,
      y: config.player.velocity.y,
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

    this.isJumping = false;
    this.isAttacking = false;
    this.lastMove = '';
  }

  setHitBox() {
    this.hitBox = {
      x: this.position.x + this.width / 3,
      y: this.position.y + this.height / 2 - 10,
      w: this.width / 3,
      h: this.height / 2 + 10,
    };
  }

  attack() {
    this.frame.position.y = this.frame.attack.y;
    this.frame.position.amount = this.frame.attack.amount;
  }

  move(direction) {
    switch (direction) {
      case 'right':
        this.flipImage = false;

        if (this.position.x < canvas.width / 2)
          this.position.x += this.velocity.x;

        if (this.lastMove !== 'right') {
          this.lastMove = 'right';
          if (!this.isJumping) {
            this.frame.position.x = 0;
            this.frame.position.y = this.frame.run.y;
            this.frame.position.amount = this.frame.run.amount;
          }
        }
        break;
      case 'left':
        this.flipImage = true;

        if (this.position.x >= 50) this.position.x -= this.velocity.x;

        if (this.lastMove !== 'left') {
          this.lastMove = 'left';
          if (!this.isJumping) {
            this.frame.position.x = 0;
            this.frame.position.y = this.frame.run.y;
            this.frame.position.amount = this.frame.run.amount;
          }
        }
        break;
      case 'jump':
        if (this.velocity.y === 0) {
          this.isJumping = true;
          this.velocity.y = -17;
          this.frame.position.x = 0;

          if (this.lastMove !== 'jump') {
            this.lastMove = 'jump';
            this.frame.position.y = this.frame.jump.y;
            this.frame.position.amount = this.frame.jump.amount;
          }
        }
        break;
      case 'fall':
        if (this.lastMove !== 'fall') {
          this.lastMove = 'fall';
        }
        break;
      case 'attack':
        if (!this.isAttacking) {
          this.lastMove = 'attack';
          this.isAttacking = true;
          this.frame.position.x = 0;
          this.frame.position.y = this.frame.attack.y;
          this.frame.position.amount = this.frame.attack.amount;
        }
        break;
      default:
        this.lastMove = 'stop';
        this.frame.position.y = this.frame.idle.y;
        this.frame.position.amount = this.frame.idle.amount;
    }
  }

  draw() {
    // ctx.fillStyle = '#033';
    // ctx.fillRect(this.hitBox.x, this.hitBox.y, this.hitBox.w, this.hitBox.h);

    ctx.save();
    if (this.flipImage) ctx.scale(-1, 1);
    ctx.drawImage(
      this.image,
      this.frame.size.x * this.frame.position.x,
      this.frame.size.y * this.frame.position.y + 1,
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
    this.setHitBox();

    // Moviments
    if (keys.k.pressed) this.move('attack');
    else if (keys.d.pressed && !this.isAttacking) this.move('right');
    else if (keys.a.pressed && !this.isAttacking) this.move('left');
    else {
      if (!this.isJumping && !this.isAttacking) this.move('stop');
    }

    if (keys.j.pressed) this.move('jump');

    if (this.isJumping && this.velocity.y > 0) {
      this.move('fall');
    }

    // Frames
    if (this.isJumping || this.isAttacking) {
      if (this.frame.position.x < this.frame.position.amount - 1) {
        if (this.isAttacking) {
          if (animationId % 6 === 0) this.frame.position.x++;
          if (this.frame.position.x === this.frame.position.amount - 1)
            this.isAttacking = false;
        } else this.frame.position.x++;
      }

      if (
        this.isAttacking &&
        this.frame.position.x === this.frame.position.amount - 1
      )
        this.isAttacking = false;
    } else {
      if (animationId % 6 === 0) this.frame.position.x++;

      if (this.frame.position.x >= this.frame.position.amount)
        this.frame.position.x = 0;
    }

    this.draw();
  }
}
