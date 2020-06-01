const fov = 60;
const fov_res = 400;
const ray_len = 10;

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
    const newX = this.x + walkDir * Math.cos(this.angle) * dt * this.walkSpeed;
    const newY = this.y + walkDir * Math.sin(this.angle) * dt * this.walkSpeed;

    if (!this.grid.getCell(Math.floor(newX / 40), Math.floor(this.y / 40)))
      this.x = newX;
    if (!this.grid.getCell(Math.floor(this.x / 40), Math.floor(newY / 40)))
      this.y = newY;

    this.angle = this.angle % deg2rad(360);
    this.x = Math.min(Math.max(0, this.x), 400);
    this.y = Math.min(Math.max(0, this.y), 400);
  }

  cast(relativeAngle) {
    const angle = this.angle + relativeAngle;

    const cos = Math.cos(angle);
    const sin = Math.sin(angle);

    const hDir = cos > 0 ? 1 : cos < 0 ? -1 : 0;
    const vDir = sin > 0 ? 1 : sin < 0 ? -1 : 0;

    const hRound = hDir > 0 ? Math.floor : Math.ceil;
    const vRound = vDir > 0 ? Math.floor : Math.ceil;

    const path = [];
    let nowX = this.x / 40;
    let nowY = this.y / 40;
    let nowDist = 0;

    while (true) {
      //  next horizontal grid intersect
      let hStepX, hStepY;
      let hStepDist = Infinity;
      if (hDir !== 0) {
        hStepX = hRound(nowX + hDir) - nowX;
        hStepY = hStepX * (sin / cos);
        hStepDist = Math.sqrt(hStepX ** 2 + hStepY ** 2);
      }

      // next vertical grid intersect
      let vStepX, vStepY;
      let vStepDist = Infinity;
      if (vDir !== 0) {
        vStepY = vRound(nowY + vDir) - nowY;
        vStepX = vStepY * (cos / sin);
        vStepDist = Math.sqrt(vStepX ** 2 + vStepY ** 2);
      }

      // closest grid intersect
      let stepX, stepY, stepDist;
      let gridOffX = 0;
      let gridOffY = 0;
      let shadow;
      if (hStepDist < vStepDist) {
        stepX = hStepX;
        stepY = hStepY;
        stepDist = hStepDist;
        gridOffX = hDir < 0 ? 1 : 0;
        shadow = hDir < 0 ? 1 : 0.3;
      } else {
        stepX = vStepX;
        stepY = vStepY;
        stepDist = vStepDist;
        gridOffY = vDir < 0 ? 1 : 0;
        shadow = vDir < 0 ? 1 : 0.6;
      }

      nowX += stepX;
      nowY += stepY;
      nowDist += stepDist;

      // done when max distance is reached
      if (nowDist > ray_len) break;

      const gridX = Math.floor(nowX - gridOffX);
      const gridY = Math.floor(nowY - gridOffY);
      const hit = this.grid.getCell(gridX, gridY);

      path.push([nowX, nowY, nowDist * Math.cos(relativeAngle), hit, shadow]);
    }

    return path;
  }

  draw(ctx) {
    ctx.fillStyle = "#3366aa";
    ctx.beginPath();
    ctx.arc(this.x, this.y, 5, 0, deg2rad(360));
    ctx.fill();

    for (let i = 0; i < fov_res; i++) {
      const a = (i * 2) / fov_res - 1;
      const ray_angle = deg2rad(-fov / 2 + fov * (i / fov_res));

      const ray = this.cast(ray_angle);
      const ray_hit = ray.find(s => s[3]) || ray[ray.length - 1];
      const ray_x = ray_hit[0] * 40;
      const ray_y = ray_hit[1] * 40;

      ctx.strokeStyle = "#333";
      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(ray_x, ray_y);
      ctx.stroke();

      const ray_dist = ray_hit[2];
      const ray_shadow = ray_hit[4];

      const fog = Math.min(1, ray_dist ** 2 / (ray_len - 1) ** 2);

      const height = 400 / ray_dist;
      const colX = 400 + i;
      const colTop = 200 - height / 2;
      const colBottom = 200 + height / 2;

      ctx.globalAlpha = 1;
      ctx.strokeStyle = "#552277";
      ctx.beginPath();
      ctx.moveTo(colX, colTop);
      ctx.lineTo(colX, colBottom);
      ctx.stroke();

      ctx.globalAlpha = ray_shadow / 2;
      ctx.strokeStyle = "#000";
      ctx.beginPath();
      ctx.moveTo(colX, colTop);
      ctx.lineTo(colX, colBottom);
      ctx.stroke();

      ctx.globalAlpha = fog;
      ctx.strokeStyle = "#fff";
      ctx.beginPath();
      ctx.moveTo(colX, colTop);
      ctx.lineTo(colX, colBottom);
      ctx.stroke();

      ctx.globalAlpha = 1;
    }
  }
}
