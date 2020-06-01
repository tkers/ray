const screen_height = 400;
const screen_width = 400;
const cell_size = 40;

let grid, player;

const draw = (ctx, dt) => {
  // console.log({ dt: (dt * 1000).toFixed(0), fps: (1 / dt).toFixed(1) });

  grid.draw(ctx);

  ctx.fillStyle = "#cbd";
  ctx.fillRect(400, 200, 400, 200);

  player.update(dt);
  player.draw(ctx);
};

window.addEventListener("load", () => {
  const canvas = document.getElementById("root");
  const ctx = canvas.getContext("2d");
  resizeCanvas(canvas, 800, 400);

  grid = new Grid();
  player = new Player(grid);

  renderLoop(dt => {
    ctx.globalAlpha = 1;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    draw(ctx, dt);
  });
});
