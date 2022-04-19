import config from '../config.js';
import { useCanvas } from '../helpers.js';

const { canvas, ctx } = useCanvas();

export class Char {
  constructor({ position, image, frame }) {
    this.position = position;
    this.velocity = {
      x: config.player.velocity.x,
      y: config.player.velocity.y,
    };
    this.width = 150;
    this.height = 150;

    this.image = image;
    this.flipImage = false;
    this.frame = frame;
    this.frame.hold = 6;
    this.frame.position = {
      x: 0,
      y: 0,
      amount: this.frame.idle.amount,
    };

    this.hitBox = {
      x: 0,
      y: 0,
      w: 0,
      h: 0,
    };

    this.attackHitBox = {
      x: 0,
      y: 0,
      w: 0,
      h: 0,
    };

    this.isJumping = false;
    this.isAttacking = false;
    this.isInvulnerable = false;
    this.isDeath = false;
    this.deathCount = 0;
    this.health = 100;
    this.damageDash = -5;
    this.lastMove = '';

    this.setHitBox();
    this.setAttackHitBox();
  }

  setHitBox() {
    let offsetX = 0.33;
    let offsetY = 0;
    if (this.flipImage) offsetX = 0.39;
    if (this.isJumping) offsetY = 0.15;

    this.hitBox = {
      x: this.position.x + this.width * offsetX,
      y: this.position.y + this.height * 0.4 - this.height * offsetY,
      w: this.width * 0.28,
      h: this.height * 0.59,
    };
  }

  setAttackHitBox() {
    let offsetX = 0.33;
    if (this.flipImage) offsetX = 0.02;

    this.attackHitBox = {
      x: this.position.x + this.width * 1.7 * offsetX,
      y: this.position.y + this.height * 0.61,
      w: this.width * 0.4,
      h: this.height * 0.15,
    };
  }

  attack() {
    this.frame.position.y = this.frame.attack.y;
    this.frame.position.amount = this.frame.attack.amount;
  }

  damage({ damageDash, hp }) {
    this.damageDash = damageDash;

    if (this.isInvulnerable === false) {
      this.isInvulnerable = true;

      if (this.health - hp > 0) {
        this.health -= hp;
        this.frame.position.y = this.frame.takeHit.y;
        this.frame.position.amount = this.frame.takeHit.amount;
      } else {
        this.health = 0;
        this.isDeath = true;
        this.deathCount++;
        this.frame.position.y = this.frame.die1.y;
        this.frame.position.amount = this.frame.die1.amount;
      }
      this.frame.position.x = 0;
    }
  }

  move(direction) {
    if (this.isInvulnerable || this.isDeath) return;

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
    ctx.fillStyle = '#900';
    ctx.fillRect(canvas.width - 220, 20, 200, 25);
    ctx.fillStyle = '#090';
    ctx.fillRect(canvas.width - 220, 20, (200 * this.health) / 100, 25);

    ctx.fillStyle = '#fff';
    ctx.font = '24px sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(`Mortes: ${this.deathCount}`, canvas.width - 20, 70);

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
    this.setAttackHitBox();

    if (this.hitBox.y > canvas.height) {
      this.isJumping = true;
      this.position.y = 0;
      this.position.x -= 200;
      this.velocity.y = 0;
      this.deathCount++;
      this.health = 0;
      setTimeout(() => {
        this.health = 100;
      }, 250);
    }

    // Moviments
    if (keys.k.pressed) this.move('attack');
    else if (keys.d.pressed && !this.isAttacking) this.move('right');
    else if (keys.a.pressed && !this.isAttacking) this.move('left');
    else {
      if (!this.isJumping && !this.isAttacking) this.move('stop');
    }

    if (keys.j.pressed && !this.isJumping) this.move('jump');

    if (this.isJumping && this.velocity.y > 0) {
      this.move('fall');
    }

    if (this.isInvulnerable) this.position.x += this.damageDash;

    // Frames
    if (
      this.isJumping ||
      this.isAttacking ||
      this.isInvulnerable ||
      this.isDeath
    ) {
      if (this.frame.position.x < this.frame.position.amount - 1) {
        if (this.isJumping && !this.isAttacking) this.frame.position.x++;
        else if (animationId % this.frame.hold === 0) this.frame.position.x++;
      } else {
        this.isAttacking = false;
        this.isInvulnerable = false;
      }

      if (
        this.isDeath &&
        this.frame.position.x === this.frame.position.amount - 1 &&
        this.frame.position.y === this.frame.die1.y
      ) {
        this.isInvulnerable = false;
        this.frame.position.x = 0;
        this.frame.position.y = this.frame.die2.y;
        this.frame.position.amount = this.frame.die2.amount;
        setTimeout(() => {
          this.isDeath = false;
          this.health = 100;
        }, 1500);
      }
    } else {
      if (animationId % this.frame.hold === 0) this.frame.position.x++;

      if (this.frame.position.x >= this.frame.position.amount)
        this.frame.position.x = 0;
    }

    this.draw();
  }
}
