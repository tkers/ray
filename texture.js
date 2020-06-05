class Texture {
  constructor(src) {
    this.img = new Image();
    this.isLoaded = false;
    this.img.onload = () => {
      this.isLoaded = true;
    };
    this.img.src = src;
  }

  drawWall(ctx, x, y, width, height, offsetX = 0) {
    if (!this.isLoaded) return;
    ctx.drawImage(
      this.img,
      Math.floor(offsetX * this.img.width),
      0,
      1,
      this.img.height,
      x,
      y,
      width,
      height
    );
  }
}
