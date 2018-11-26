import ParticlePool from './particlePool.js';

/** @Class BoostBar
  * Class to help display the players boost.
  */
export default class BoostBar {
/** @Constructor
  * Sets up the main aspects of the boost bar.
  * @param {int} boost - the amount of boost the player has
  * @param {int} max - the maximum amount of the boost possible.
  */
  constructor(boost, max) {
    //Position variables
    this.x = 500;
    this.y = 950;
    //Dimension variables
    this.width = 400;
    this.height = 25;
    this.MAXBOOST = max;
    this.boost = boost;
    //Keeps track of particles for particle effect
    this.particles = new ParticlePool(200, 'green', 5.0);
    //Keepts track of the ratio of boost to Max Boost.
    this.fillLength = this.width * (this.boost / this.MAXBOOST);
  }

  /** @Function createParticles()
    * Function to add particles to the particle object pool.
    * @param {int} numParticles - number of particles to add to the pool.
    */
  createParticles(numParticles) {
    //All particles will start on the left of the BoostBar
    let x = 1 + this.x - this.width / 2;
    for (let i = 0; i < numParticles; i++) {
      //Pick a random y position on the BoostBar
      let y = Math.randomBetween(this.y - this.height / 2, this.y + this.height / 2);
      this.particles.add(x, y, Math.PI / 2, 0.0, 7.5);
    }
  }

  /** @Function update()
    * Function to update all the variables that need to be updated every frame.
    */
  update() {
    //Recalcultes the ratio of boost to MAXBOOST
    this.fillLength = this.width * (this.boost / this.MAXBOOST)
    // Create some particles
    this.createParticles(3);
    this.particles.update();
  }

  /** @Function render()
    * Standard render function.
    * @param {canvas context} ctx - backBufferContext
    */
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
