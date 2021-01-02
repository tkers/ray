const getPixelRatio = ctx => {
  const dpr = window.devicePixelRatio || 1;
  const bsr =
    ctx.webkitBackingStorePixelRatio ||
    ctx.mozBackingStorePixelRatio ||
    ctx.msBackingStorePixelRatio ||
    ctx.oBackingStorePixelRatio ||
    ctx.backingStorePixelRatio ||
    1;

  return dpr / bsr;
};

const resizeCanvas = function(canvas, width, height) {
  const ctx = canvas.getContext("2d");
  const ratio = getPixelRatio(ctx);
  canvas.width = width * ratio;
  canvas.height = height * ratio;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  ctx.imageSmoothingEnabled = false;
  return canvas;
};

const renderLoop = draw => {
  let pt = 0;
  const tick = t => {
    const dt = (t - pt) / 1000;
    pt = t;
    draw(dt);
    window.requestAnimationFrame(tick);
  };
  tick(0);
};
