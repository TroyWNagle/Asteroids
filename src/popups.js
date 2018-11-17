

export default class PopUp {
  constructor(x, y, string, type) {
    this.x = x;
    this.y = y;
    this.type = type;
    this.string = '';
    this.life = 0;
    this.size = 0;
    this.initSettings(string);
    this.color = 'yellow';
  }

  initSettings(string) {
    switch (this.type) {
      case "blip":
        this.life = 40;
        this.size = 25;
        this.string = '+ ' + string;
        break;
      case "annoucement":
        this.life = 80;
        this.size = 50;
        this.string = string;
        break;
      default:

    }
  }

  update() {
    this.life--;
    if(this.life <= 0) {
      return true;
    }
  }

  render(ctx) {
    ctx.save();
    ctx.fillStyle = this.color;
    ctx.font = this.size + "px Arial";
    ctx.fillText(this.string, this.x, this.y);
    ctx.restore();
  }
}
