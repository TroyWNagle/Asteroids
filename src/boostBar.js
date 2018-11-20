import ParticlePool from './particlePool.js';

export default class BoostBar {
  constructor(boost, max) {
    this.x = 500;
    this.y = 950;
    this.width = 400;
    this.height = 25;
    this.MAXBOOST = max;
    this.boost = boost;
    this.particles = new ParticlePool(200, 'green', 5.0);
    this.fillLength = this.width * (this.boost / this.MAXBOOST);
  }

  createParticles(numParticles) {
    let x = 1 + this.x - this.width / 2;
    for (let i = 0; i < numParticles; i++) {
      let y = Math.randomBetween(this.y - this.height / 2, this.y + this.height / 2);
      this.particles.add(x, y, Math.PI / 2, 0.0, 7.5);
    }
  }

  update() {
    this.fillLength = this.width * (this.boost / this.MAXBOOST)
    this.createParticles(3);
    //Particle effect for the thruster
    this.particles.update();
  }

  render(ctx) {
    ctx.save();
    ctx.strokeStyle = 'blue';
    ctx.fillStyle = 'blue';
    ctx.globalAlpha = 0.30;
    ctx.strokeRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
    ctx.fillRect(this.x - this.width / 2, this.y - this.height / 2, this.fillLength, this.height);
    ctx.restore();
    this.particles.render(ctx);
  }
}
