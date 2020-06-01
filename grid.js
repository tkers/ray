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
    this.width = 10;
    this.height = 10;
  }

  getCell(x, y) {
    const row = this.map[y];
    return row && !!row[x];
  }

  draw(ctx) {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        ctx.fillStyle = this.map[y][x] ? "#aa66bb" : "#ddd";
        ctx.fillRect(x * cell_size, y * cell_size, cell_size, cell_size);
      }
    }

    ctx.strokeStyle = "#000";
    for (let y = 0; y < this.height; y++) {
      ctx.beginPath();
      ctx.moveTo(0, y * cell_size);
      ctx.lineTo(screen_height, y * cell_size);
      ctx.stroke();
    }
    for (let x = 0; x < this.width; x++) {
      ctx.beginPath();
      ctx.moveTo(x * cell_size, 0);
      ctx.lineTo(x * cell_size, screen_width);
      ctx.stroke();
    }
  }
}
