import Particle from './particles.js';

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
      direction += Math.PI * 2
    }
    this.velocity = {mag: 5.0, dir: direction};
    this.speed = {x: 0.0, y: 0.0};
    this.initSpeed();
    //Particle trail of the projectile
    this.particles = [];
  }

  /** @function createParticles()
    * function to handle creating the particles for trail of the projectile
    * @param int numParticles - number of particles to be created
    */
  createParticles(numParticles) {
    //Get the back of the projectile
    var x = this.x + Math.sin(this.velocity.dir)* this.radius;
    var y = this.y - Math.cos(this.velocity.dir)* this.radius;
    for(var i = 0; i < numParticles; i++) {
      //Spread the particles over the projectile
      var dx = x + Math.randomBetween(-this.radius, this.radius);
      var dy = y + Math.randomBetween(-this.radius, this.radius);
      this.particles.push(new Particle(dx, dy, Math.PI * this.velocity.dir, 1.0, this.color, 10));
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
    this.y + this.radius >= 1000|| this.y - this.radius <= 0) {
      return true;
    }
    return false;
  }

  /** @function update()
    * typical update function, also updates its particle trail
    */
  update(targets) {
    this.createParticles(Math.randomInt(3, 6));
    this.x += this.speed.x;
    this.y += this.speed.y;
    //Particle effect for the trail
    for(var j = 0; j < this.particles.length; j++) {
      this.particles[j].update();
      if(this.particles[j].life <= 0) {
        this.particles.splice(j, 1);
      }
    }
  }

  /** @function render()
    * standard render function
    * @param context ctx - backBufferContext from game.js
    */
  render(ctx) {
    ctx.save();
    ctx.strokeStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.closePath();
    ctx.stroke();
    ctx.restore();
    this.particles.forEach(particle => {
      particle.render(ctx);
    });
  }
}
