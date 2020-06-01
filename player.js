const fov = 60;
const fov_res = 16;
const ray_len = 5;

class Player {
  turnSpeed = deg2rad(360);
  walkSpeed = 100;

  x = 50;
  y = 50;
  angle = 0;

  k_up = false;
  k_down = false;
  k_left = false;
  k_right = false;

  constructor(grid) {
    this.grid = grid;

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
    this.x += walkDir * Math.cos(this.angle) * dt * this.walkSpeed;
    this.y += walkDir * Math.sin(this.angle) * dt * this.walkSpeed;

    this.angle = this.angle % deg2rad(360);
    this.x = Math.min(Math.max(0, this.x), 400);
    this.y = Math.min(Math.max(0, this.y), 400);
  }

  draw(ctx) {
    ctx.fillStyle = "#3366aa";
    ctx.beginPath();
    ctx.arc(this.x, this.y, 5, 0, deg2rad(360));
    ctx.fill();

    for (let i = 0; i < fov_res; i++) {
      const a = (i * 2) / fov_res - 1;
      const ray_angle = deg2rad(-fov / 2 + fov * (i / fov_res));
      const ray_x = this.x + Math.cos(this.angle + ray_angle) * ray_len * 40;
      const ray_y = this.y + Math.sin(this.angle + ray_angle) * ray_len * 40;
      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(ray_x, ray_y);
      ctx.stroke();
    }
  }
}
