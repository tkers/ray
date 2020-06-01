const default_map = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 1, 1, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 1, 0, 0, 1, 1, 1],
  [1, 0, 0, 0, 1, 0, 0, 0, 0, 1],
  [1, 0, 0, 1, 1, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 1, 1, 0, 1],
  [1, 1, 1, 0, 0, 0, 1, 0, 0, 1],
  [1, 1, 1, 0, 0, 0, 1, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];

class Grid {
  constructor(map = default_map) {
    this.map = map;
  }

  getCell(x, y) {
    const row = this.map[y];
    return row && !!row[x];
  }

  draw(ctx) {
    for (let y = 0; y < this.map.length; y++) {
      for (let x = 0; x < this.map[y].length; x++) {
        ctx.fillStyle = this.map[y][x] ? "#aa66bb" : "#ddd";
        ctx.fillRect(x * 40, y * 40, 40, 40);
      }
    }

    ctx.strokeStyle = "#000";
    for (let y = 0; y < this.map.length; y++) {
      ctx.beginPath();
      ctx.moveTo(0, y * 40);
      ctx.lineTo(400, y * 40);
      ctx.stroke();
    }
    for (let x = 0; x < this.map[0].length; x++) {
      ctx.beginPath();
      ctx.moveTo(x * 40, 0);
      ctx.lineTo(x * 40, 400);
      ctx.stroke();
    }
  }
}
