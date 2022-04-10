import { Char } from './classes/Char.js';
import { createImage, useCanvas } from './helpers.js';

const { canvas, ctx } = useCanvas();
canvas.width = 1200;
canvas.height = 640;

var player;

function gameStart() {
  player = new Char({
    position: {
      x: 100,
      y: 400,
    },
    width: 110,
    height: 110,
    image: createImage('./assets/player/1.png'),
    frame: {
      size: {
        x: 56,
        y: 56,
      },
      idle: {
        amount: 6,
        y: 0,
      },
      attack: {
        amount: 8,
        y: 1,
      },
      run: {
        amount: 8,
        y: 2,
      },
      jump: {
        amount: 8,
        y: 3,
      },
      fall: {
        amount: 8,
        y: 4,
      },
      takeHit: {
        amount: 4,
        y: 5,
      },
      die1: {
        amount: 8,
        y: 6,
      },
      die2: {
        amount: 4,
        y: 7,
      },
      spellCast: {
        amount: 8,
        y: 8,
      },
      crouch: {
        amount: 3,
        y: 9,
      },
      defence: {
        amount: 3,
        y: 10,
      },
    },
  });

  animate();
}

const playerKeys = {
  a: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
};

function animate() {
  const animationId = requestAnimationFrame(animate);

  ctx.fillStyle = '#666';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  player.update({ animationId, keys: playerKeys });
}

gameStart();

document.addEventListener('keydown', ({ key }) => {
  if (Object.keys(playerKeys).includes(key)) playerKeys[key].pressed = true;
});

document.addEventListener('keyup', ({ key }) => {
  if (Object.keys(playerKeys).includes(key)) playerKeys[key].pressed = false;
});
