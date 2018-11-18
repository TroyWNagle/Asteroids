

export default class HUDObject {
  constructor(x, y, type, information) {
    this.x = x;
    this.y = y;
    this.type = type;
    this.info = information;
  }

  render(ctx) {
    ctx.save();
    ctx.fillStyle = 'yellow';
    ctx.font = "30px Arial";
    ctx.globalAlpha = 0.70;
    ctx.fillText(this.type + this.info, this.x, this.y);
    ctx.restore();
  }
}
