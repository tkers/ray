const screen_height = 400;
const screen_width = 400;
const cell_size = 40;

let grid, player, camera, wall, sky;

const draw = (ctx, dt) => {
  // console.log({ dt: (dt * 1000).toFixed(0), fps: (1 / dt).toFixed(1) });

  grid.draw(ctx);

  player.update(dt);
  player.draw(ctx);

  camera.draw(ctx, player.x, player.y, normalise(player.angle));
};

window.addEventListener("load", () => {
  const canvas = document.getElementById("root");
  const ctx = canvas.getContext("2d");
  resizeCanvas(canvas, 800, 400);

  wall = new Texture("wall.png");
  sky = new Texture("sky.png");
  grid = new Grid();
  player = new Player(grid);
  camera = new Camera(grid);

  renderLoop(dt => {
    ctx.globalAlpha = 1;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    draw(ctx, dt);
  });
});
