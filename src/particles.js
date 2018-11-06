
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
    this.speed = speed;
    this.speedX = Math.cos(direction) * this.speed;
    this.speedY = -Math.sin(direction) * this.speed;
    this.decayDistance = Math.randomBetween(10, 50);
  }
  /** @function update()
    * function to updates the particle if it hasn't hit the decay distance
    */
  update() {
    var dx = this.startX - this.x;
    var dy = this.startY - this.y;
    this.life--;
    if(this.decayDistance * this.decayDistance <= dx * dx + dy * dy) {
      return;
    }
    this.x += this.speedX;
    this.y += this.speedY;
  }
  /** @function render()
    * standard render function
    */
  render(ctx) {
    ctx.save()
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, 1, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }
}
