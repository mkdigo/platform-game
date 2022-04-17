import { createImage, useCanvas } from '../helpers.js';
import config from '../config.js';

const { ctx } = useCanvas();

export class Enemy {
  constructor({ position, width, height, image, emblem }) {
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
          x: 28,
          y: 1,
          w: 100,
          h: 100,
        },
        hitBox: {
          rightOffsetX: 0.42,
          rightOffsetY: 0.67,
          leftOffsetX: 0.42,
          leftOffsetY: 0.67,
        },
        attackHitBox: {
          rightOffsetX: 0.08,
          rightOffsetY: 0.67,
          leftOffsetX: 0.08,
          leftOffsetY: 0.67,
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
          x: 54,
          y: 50,
          w: 50,
          h: 50,
        },
        hitBox: {
          rightOffsetX: 0.28,
          rightOffsetY: 0.2,
          leftOffsetX: 0.28,
          leftOffsetY: 0.2,
        },
        attackHitBox: {
          rightOffsetX: 0.15,
          rightOffsetY: 0.3,
          leftOffsetX: 0.15,
          leftOffsetY: 0.3,
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
          x: 0,
          y: -50,
          w: 150,
          h: 150,
        },
        hitBox: {
          rightOffsetX: 0.44,
          rightOffsetY: 0.77,
          leftOffsetX: 0.44,
          leftOffsetY: 0.77,
        },
        attackHitBox: {
          rightOffsetX: 0.3,
          rightOffsetY: 0.8,
          leftOffsetX: 0.3,
          leftOffsetY: 0.8,
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
          x: 0,
          y: -50,
          w: 150,
          h: 150,
        },
        hitBox: {
          rightOffsetX: 0.4,
          rightOffsetY: 0.66,
          leftOffsetX: 0.4,
          leftOffsetY: 0.66,
        },
        attackHitBox: {
          rightOffsetX: 0.0,
          rightOffsetY: 0.65,
          leftOffsetX: 0.0,
          leftOffsetY: 0.65,
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
      hold: 9,
      x: this.images[this.image].frame.x,
      y: this.images[this.image].frame.y,
      w: this.images[this.image].frame.w,
      h: this.images[this.image].frame.h,
      image: this.images[this.image].idle.image,
      amount: this.images[this.image].idle.amount,
    };
    this.flipImage = true;
    this.health = 100;
    this.isInvulnerable = false;
    this.isDeath = false;
    this.isAttacking = false;
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
    this.emblem = emblem;
  }

  setHitBox() {
    let offsetX = this.images[this.image].hitBox.rightOffsetX;
    let offsetY = this.images[this.image].hitBox.rightOffsetY;
    if (this.flipImage) offsetX = this.images[this.image].hitBox.leftOffsetX;
    if (this.flipImage) offsetY = this.images[this.image].hitBox.leftOffsetY;

    this.hitBox = {
      x: this.position.x + this.width * offsetX,
      y: this.position.y + this.height * offsetY,
      w: this.width - this.width * offsetX * 2,
      h: this.height * (1 - offsetY),
    };
  }

  setAttackHitBox() {
    let offsetX = this.images[this.image].attackHitBox.rightOffsetX;
    let offsetY = this.images[this.image].attackHitBox.rightOffsetY;
    if (this.flipImage)
      offsetX = this.images[this.image].attackHitBox.leftOffsetX;
    if (this.flipImage)
      offsetY = this.images[this.image].attackHitBox.leftOffsetY;

    this.attackHitBox = {
      x: this.position.x + this.width * offsetX,
      y: this.position.y + this.height * offsetY,
      w: this.width - this.width * offsetX * 2,
      h: this.height * (1 - offsetY),
    };
  }

  damage(n) {
    if (this.isInvulnerable === false) {
      this.isInvulnerable = true;
      if (this.health - n > 0) {
        this.health -= n;
        this.frame.image = this.images[this.image].takeHit.image;
        this.frame.amount = this.images[this.image].takeHit.amount;
      } else {
        this.health = 0;
        this.isDeath = true;
        this.frame.image = this.images[this.image].death.image;
        this.frame.amount = this.images[this.image].death.amount;
      }
      this.frame.current = 0;
      this.frame.hold = 12;
    }
  }

  attack() {
    this.isAttacking = true;
    this.frame.image = this.images[this.image].attack.image;
    this.frame.amount = this.images[this.image].attack.amount;
    this.frame.current = 0;
  }

  draw() {
    // ctx.fillStyle = '#333';
    // ctx.fillRect(this.position.x, this.position.y, this.width, this.height);

    // ctx.fillStyle = '#333';
    // ctx.fillRect(this.hitBox.x, this.hitBox.y, this.hitBox.w, this.hitBox.h);

    // ctx.fillStyle = '#900';
    // ctx.fillRect(
    //   this.attackHitBox.x,
    //   this.attackHitBox.y,
    //   this.attackHitBox.w,
    //   this.attackHitBox.h
    // );

    // Render Health
    ctx.fillStyle = '#900';
    ctx.fillRect(this.hitBox.x, this.hitBox.y - 20, this.hitBox.w, 5);
    ctx.fillStyle = '#090';
    ctx.fillRect(
      this.hitBox.x,
      this.hitBox.y - 20,
      (this.hitBox.w * this.health) / 100,
      5
    );

    // Render Enemy
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

  update({ animationId, mapMovingLeft, mapMovingRight }) {
    this.setHitBox();
    this.setAttackHitBox();

    if (mapMovingLeft) {
      this.position.x += config.player.velocity.x;
      if (!this.emblem.isFixed)
        this.emblem.position.x += config.player.velocity.x;
    } else if (mapMovingRight) {
      this.position.x -= config.player.velocity.x;
      if (!this.emblem.isFixed)
        this.emblem.position.x -= config.player.velocity.x;
    }

    if (animationId % this.frame.hold === 0) this.frame.current++;

    if (animationId % 150 === 0 && !this.isAttacking && !this.isDeath)
      this.attack();

    if (this.frame.current >= this.frame.amount) {
      this.frame.current = 0;
      if ((this.isInvulnerable && !this.isDeath) || this.isAttacking) {
        this.isInvulnerable = false;
        this.isAttacking = false;
        this.frame.hold = 9;
        this.frame.image = this.images[this.image].idle.image;
        this.frame.amount = this.images[this.image].idle.amount;
      }
      if (this.isDeath) this.frame.current = this.frame.amount - 1;
    }

    this.draw();
  }
}
