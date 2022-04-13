export function useCanvas() {
  const canvas = document.querySelector('canvas');
  const ctx = canvas.getContext('2d');
  return { canvas, ctx };
}

export function createImage(src) {
  const image = new Image();
  image.src = String(src);
  return image;
}

export function collision({ ax, ay, aw, ah, bx, by, bw, bh }) {
  return ax + aw >= bx && ax <= bx + bw && ay + ah >= by && ay <= by + bh;
}
