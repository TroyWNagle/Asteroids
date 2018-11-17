
/** @class Particle
  * class to handle a particle's life
  */
export default class Particle {
  /** @constructor
    * initialization of a particle
    * @param floats x,y - position of the particle
    * @param float direction - direction the particle will travel
    * @param int speed - velocity of the particle
    * @param string color - color of the particle
    * @param int life - how many iterations the particle will last for
    */
  constructor(x, y, direction, speed, color, life, decay) {
    this.x = x;
    this.y = y;
    this.life = life;
    this.decay = decay
    this.color = color;
    this.alpha = 1.0;
    this.values = {high: 1.0, low: 0.7};
    this.clock = 10;
    this.speed = Math.randomInt(1, speed);
    this.direction = direction;
    this.speedX = Math.cos(direction) * this.speed;
    this.speedY = -Math.sin(direction) * this.speed;
  }

  changeAlpha() {
    if(this.alpha === this.values.high) {
      this.alpha = this.values.low;
    }
    else {
      this.alpha = this.values.high;
    }
  }

  updateSpeed() {
    this.speedX = Math.cos(this.direction) * this.speed;
    this.speedY = -Math.sin(this.direction) * this.speed;
  }

  /** @function update()
    * function to updates the particle if it hasn't hit the decay distance
    */
  update() {
    this.clock--;
    if(this.clock <= 0) {
      this.clock = 10;
      this.changeAlpha();
    }
    this.life--;
    if(this.decay && this.speed > 0) {
      this.speed -= 0.05;
      this.updateSpeed();
    }
    this.x += this.speedX;
    this.y += this.speedY;
  }
  /** @function render()
    * standard render function
    */
  render(ctx) {
    ctx.save();
    ctx.fillStyle = this.color;
    ctx.globalAlpha = this.alpha;
    ctx.beginPath();
    ctx.arc(this.x, this.y, 1, 0, Math.tau);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }
}
