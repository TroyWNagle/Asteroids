import ParticlePool from './particlePool.js';

/** @class Projectile
  * Class to handle projectiles
  */
export default class Projectile {
  constructor(x, y, direction, color) {
    this.x = x;
    this.y = y;
    this.radius = 3.5;
    this.color = color;
    if(direction < 0) {
      direction += Math.tau;
    }
    this.velocity = {mag: 5.0, dir: direction};
    this.speed = {x: 0.0, y: 0.0};
    this.initSpeed();
    this.particlePool = new ParticlePool(50, this.color, 1.0);
  }

  /** @function createParticles()
    * function to handle creating the particles for trail of the projectile
    * @param int numParticles - number of particles to be created
    */
  createParticles(numParticles) {
    //Get the back of the projectile
    let x = this.x - Math.sin(this.velocity.dir)* this.radius;
    let y = this.y + Math.cos(this.velocity.dir)* this.radius;
    for(let i = 0; i < numParticles; i++) {
      //Spread the particles over the projectile
      let dx = x + Math.randomBetween(-this.radius, this.radius);
      let dy = y + Math.randomBetween(-this.radius, this.radius);
      this.particlePool.add(dx, dy, Math.PI * this.velocity.dir, -0.05, 1.0)
    }
  }

  /** @function initSpeed()
    * function to handle speed initialization
    */
  initSpeed() {
    this.speed.x = Math.sin(this.velocity.dir) * this.velocity.mag;
    this.speed.y = -Math.cos(this.velocity.dir) * this.velocity.mag;
  }

  /** @function edgeDetection()
    * function to handle edgeDetection of projectiles, projectiles are destroyed at the edge
    */
  edgeDetection() {
    if(this.x + this.radius >= 1000 || this.x - this.radius <= 0 ||
    this.y + this.radius >= 1000 || this.y - this.radius <= 0) {
      return true;
    }
    return false;
  }

  /** @function update()
    * typical update function, also updates its particle trail
    */
  update(targets) {
    this.createParticles(Math.randomInt(2, 4));
    this.x += this.speed.x;
    this.y += this.speed.y;
    this.particlePool.update();
  }

  /** @function render()
    * standard render function
    * @param context ctx - backBufferContext from game.js
    */
  render(ctx) {
    ctx.save();
    ctx.strokeStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.tau);
    ctx.closePath();
    ctx.stroke();
    ctx.restore();
    this.particlePool.render(ctx);
  }
}
