const focal_length = 2;
const ray_len = 18;
const fog_dist = ray_len - 2;

const xoffset_3d = 400;

class Camera {
  constructor(grid) {
    this.grid = grid;
  }

  cast(x, y, baseAngle, relativeAngle) {
    const angle = baseAngle + relativeAngle;

    const cos = Math.cos(angle);
    const sin = Math.sin(angle);

    const hDir = cos > 0 ? 1 : cos < 0 ? -1 : 0;
    const vDir = sin > 0 ? 1 : sin < 0 ? -1 : 0;

    const hRound = hDir > 0 ? Math.floor : Math.ceil;
    const vRound = vDir > 0 ? Math.floor : Math.ceil;

    const path = [];
    let nowX = x;
    let nowY = y;
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
      let shadow, offset;
      if (hStepDist < vStepDist) {
        stepX = hStepX;
        stepY = hStepY;
        stepDist = hStepDist;
        gridOffX = hDir < 0 ? 1 : 0;
        shadow = hDir < 0 ? 1 : 0.3;
        offset = (nowY + hStepY) % 1;
      } else {
        stepX = vStepX;
        stepY = vStepY;
        stepDist = vStepDist;
        gridOffY = vDir < 0 ? 1 : 0;
        shadow = vDir < 0 ? 1 : 0.6;
        offset = (nowX + vStepX) % 1;
      }

      nowX += stepX;
      nowY += stepY;
      nowDist += stepDist;

      // done when max distance is reached
      if (nowDist > ray_len) break;

      const gridX = Math.floor(nowX - gridOffX);
      const gridY = Math.floor(nowY - gridOffY);
      const hit = this.grid.getCell(gridX, gridY);

      path.push([
        nowX,
        nowY,
        nowDist * Math.cos(relativeAngle),
        hit,
        offset,
        shadow
      ]);
    }

    return path;
  }

  draw(ctx, x, y, angle) {
    // draw floor
    ctx.fillStyle = "#cbd";
    ctx.fillRect(
      xoffset_3d,
      screen_height / 2,
      screen_width,
      screen_height / 2
    );

    //draw sky
    sky.drawSky(ctx, angle, 400, 200);

    for (let i = 0; i < screen_width; i++) {
      const a = (i * 2) / screen_width - 1;
      const ray_angle = Math.atan2(a, focal_length);

      const ray = this.cast(x, y, angle, ray_angle);
      const ray_hit = ray.find(s => s[3]) || ray[ray.length - 1];
      const ray_x = ray_hit[0];
      const ray_y = ray_hit[1];

      // show rays on 2d view
      if (i % 10 === 0) {
        ctx.strokeStyle = "#333";
        ctx.beginPath();
        ctx.moveTo(x * cell_size, y * cell_size);
        ctx.lineTo(ray_x * cell_size, ray_y * cell_size);
        ctx.stroke();
      }

      const ray_dist = ray_hit[2];
      const ray_offset = ray_hit[4];
      const ray_shadow = ray_hit[5];

      const height = screen_height / ray_dist;
      const colX = xoffset_3d + i;
      const colBottom = screen_height / 2 + height / 2;
      const colTop = colBottom - height;

      wall.drawWall(ctx, colX, colTop, 1, height, ray_offset);

      // shadow
      ctx.globalAlpha = ray_shadow / 2;
      ctx.strokeStyle = "#000";
      ctx.beginPath();
      ctx.moveTo(colX, colTop);
      ctx.lineTo(colX, colBottom);
      ctx.stroke();

      // fog
      ctx.globalAlpha = Math.min(1, ray_dist ** 2 / fog_dist ** 2);
      ctx.strokeStyle = "#fff";
      ctx.beginPath();
      ctx.moveTo(colX, colTop);
      ctx.lineTo(colX, colBottom);
      ctx.stroke();

      ctx.globalAlpha = 1;
    }
  }
}
