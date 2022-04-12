import { Char } from './classes/Char.js';
import { Background } from './classes/Background.js';
import { createImage, useCanvas } from './helpers.js';
import { Tileset } from './classes/Tileset.js';
import config from './config.js';

const { canvas, ctx } = useCanvas();
canvas.width = 900;
canvas.height = 560;

var player;
var backgrounds = [];
var tilesets = [];
var mapSize = 0;

function gameStart() {
  player = new Char({
    position: {
      x: 200,
      y: 50,
    },
    width: 150,
    height: 150,
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

  backgrounds = [
    new Background({
      velocity: {
        x: 1,
        y: 0,
      },
      image: createImage('./assets/background/1.png'),
    }),
    new Background({
      velocity: {
        x: 2,
        y: 0,
      },
      image: createImage('./assets/background/2.png'),
    }),
    new Background({
      velocity: {
        x: 3,
        y: 0,
      },
      image: createImage('./assets/background/3.png'),
    }),
  ];

  const addGround = ({ gap, up } = { gap: 0, up: 0 }) => {
    tilesets.push(
      new Tileset({
        element: 'ground',
        position: {
          x: mapSize + gap,
          y: canvas.height - up,
        },
      })
    );
    mapSize += 50 * 3 - 2 + gap;
  };
  addGround();
  addGround();
  addGround();
  addGround();
  addGround();
  addGround();
  addGround();
  addGround();
  addGround();
  addGround();

  animate();
}

const playerKeys = {
  a: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
  space: {
    pressed: false,
  },
  j: {
    pressed: false,
  },
};

function animate() {
  const animationId = requestAnimationFrame(animate);

  ctx.fillStyle = '#666';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Gravity
  player.position.y += player.velocity.y;
  player.velocity.y += config.gravity;

  //Backgrounds
  backgrounds.forEach((background) => {
    background.update({
      keys: playerKeys,
      playerPositionX: player.position.x,
      isPlayerAttacking: player.isAttacking,
      mapSize,
    });
  });

  // Tilesets
  tilesets.forEach((tileset) => {
    tileset.update({
      keys: playerKeys,
      playerPositionX: player.position.x,
      isPlayerAttacking: player.isAttacking,
      mapSize,
    });

    // Player collision
    if (
      player.position.y + player.height + player.velocity.y >=
        tileset.position.y + 2 &&
      player.position.y + player.height + player.velocity.y <=
        tileset.position.y + 30 &&
      player.hitBox.x + player.hitBox.w >= tileset.position.x &&
      player.hitBox.x <= tileset.position.x + tileset.width
    ) {
      player.velocity.y = 0;
      player.isJumping = false;
    }
  });

  player.update({ animationId, keys: playerKeys });
}

gameStart();

document.addEventListener('keydown', ({ key }) => {
  if (key === ' ') key = 'space';
  if (Object.keys(playerKeys).includes(key)) playerKeys[key].pressed = true;
});

document.addEventListener('keyup', ({ key }) => {
  if (key === ' ') key = 'space';
  if (Object.keys(playerKeys).includes(key)) playerKeys[key].pressed = false;
});
