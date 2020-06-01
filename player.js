class Player {
  constructor(grid) {
    this.grid = grid;

    this.turnSpeed = deg2rad(360);
    this.walkSpeed = 2.5;

    this.x = 1.5;
    this.y = 1.5;
    this.angle = 0;

    this.k_up = false;
    this.k_down = false;
    this.k_left = false;
    this.k_right = false;

    window.addEventListener("keydown", e => {
      if (e.key === "ArrowUp") {
        this.k_up = true;
      } else if (e.key === "ArrowDown") {
        this.k_down = true;
      } else if (e.key === "ArrowLeft") {
        this.k_left = true;
      } else if (e.key === "ArrowRight") {
        this.k_right = true;
      }
    });

    window.addEventListener("keyup", e => {
      if (e.key === "ArrowUp") {
        this.k_up = false;
      } else if (e.key === "ArrowDown") {
        this.k_down = false;
      } else if (e.key === "ArrowLeft") {
        this.k_left = false;
      } else if (e.key === "ArrowRight") {
        this.k_right = false;
      }
    });
  }

  update(dt) {
    const turnDir = (this.k_right ? 1 : 0) + (this.k_left ? -1 : 0);
    const walkDir = (this.k_up ? 1 : 0) + (this.k_down ? -1 : 0);

    this.angle += turnDir * dt * this.turnSpeed;
    const newX = this.x + walkDir * Math.cos(this.angle) * dt * this.walkSpeed;
    const newY = this.y + walkDir * Math.sin(this.angle) * dt * this.walkSpeed;

    if (!this.grid.getCell(Math.floor(newX), Math.floor(this.y))) this.x = newX;
    if (!this.grid.getCell(Math.floor(this.x), Math.floor(newY))) this.y = newY;

    this.angle = this.angle % deg2rad(360);
    this.x = Math.min(Math.max(0, this.x), this.grid.width);
    this.y = Math.min(Math.max(0, this.y), this.grid.height);
  }

  draw(ctx) {
    ctx.fillStyle = "#3366aa";
    ctx.beginPath();
    ctx.arc(this.x * cell_size, this.y * cell_size, 5, 0, deg2rad(360));
    ctx.fill();
  }
}
