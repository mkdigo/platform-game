import { useCanvas } from './helpers.js';

const { canvas, ctx } = useCanvas();
canvas.width = 1200;
canvas.height = 640;

function gameStart() {
  animate();
}

function animate() {
  const animationId = requestAnimationFrame(animate);

  ctx.fillStyle = '#666';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

gameStart();
