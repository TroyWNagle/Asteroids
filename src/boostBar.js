import Particle from './particles.js';

export default class BoostBar {
  constructor(boost, max) {
    this.x = 500;
    this.y = 950;
    this.width = 400;
    this.height = 25;
    this.MAXBOOST = max;
    this.boost = boost;
    this.particles = [];
    this.fillLength = this.width * (this.boost / this.MAXBOOST);
  }

  createParticles(numParticles) {
    let x = 1 + this.x - this.width / 2;
    for (let i = 0; i < numParticles; i++) {
      let y = Math.randomBetween(this.y - this.height / 2, this.y + this.height / 2);
      this.particles.push(new Particle(x, y, 0, 5.0, 'green', 75, false));
    }
  }

  update() {
    this.fillLength = this.width * (this.boost / this.MAXBOOST)
    this.createParticles(3);
    //Particle effect for the thruster
    for(var j = 0; j < this.particles.length; j++) {
      this.particles[j].update();
      if(this.particles[j].life <= 0 || this.particles[j].x > this.x - this.width / 2 + this.fillLength) {
        this.particles.splice(j, 1);
      }
    }
  }

  render(ctx) {
    ctx.save();
    ctx.strokeStyle = 'blue';
    ctx.fillStyle = 'blue';
    ctx.globalAlpha = 0.30;
    ctx.strokeRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
    ctx.fillRect(this.x - this.width / 2, this.y - this.height / 2, this.fillLength, this.height);
    this.particles.forEach(particle => {
      particle.render(ctx);
    });
    ctx.restore();
  }
}
