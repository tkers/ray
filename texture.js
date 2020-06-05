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

  drawSky(ctx, angle, screenWidth = 400, screenHeight = 200) {
    const x = 400;
    if (!this.isLoaded) return;
    const width = this.img.width * (screenHeight / this.img.height) * 2;
    const part = angle / Math.PI / 2;

    ctx.drawImage(
      this.img,
      part * this.img.width,
      0,
      this.img.width,
      this.img.height,
      x,
      0,
      width,
      screenHeight
    );
    ctx.drawImage(
      this.img,
      0,
      0,
      this.img.width,
      this.img.height,
      x + width - part * width,
      0,
      width,
      screenHeight
    );
  }
}
