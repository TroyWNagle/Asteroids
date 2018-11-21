

export default class PowerUpDisplay {
  constructor(x, y, type, timer) {
    this.x = x;
    this.y = y;
    this.timer = timer;
    this.type = type;
    this.initColor();
  }

  initColor() {
    switch (this.type) {
      case 1:
        this.color = 'red';
        this.string = 'Homing: ';
        break;
      case 2:
        this.color = 'green';
        this.string = 'Rapid: '
        break;
      case 3:
        this.color = 'magenta';
        this.string = 'Shield: ';
        break;
      default:

    }
  }

  render(ctx) {
    ctx.save();
    ctx.fillStyle = this.color;
    ctx.font = "25px Arial";
    ctx.globalAlpha = 0.60;
    ctx.fillText(this.string + (this.timer / 60).toFixed(1), this.x, this.y);
    ctx.restore();
  }
}
