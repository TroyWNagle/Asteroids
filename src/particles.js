
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
  constructor(x, y, direction, speed, color, life) {
    this.startX = x;
    this.startY = y;
    this.x = x;
    this.y = y;
    this.life = life;
    this.color = color;
    this.speed = Math.randomInt(0, speed);
    this.speedX = Math.cos(direction) * this.speed;
    this.speedY = -Math.sin(direction) * this.speed;
  }

  /** @function update()
    * function to updates the particle if it hasn't hit the decay distance
    */
  update() {
    this.life--;
    this.x += this.speedX;
    this.y += this.speedY;
    //this.changeColor();
  }
  /** @function render()
    * standard render function
    */
  render(ctx) {
    ctx.save();
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, 1, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }
}
