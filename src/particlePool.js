
/** @Class ParticlePool
  * Object pool that manipulates a pool of custom particles for visual effects.
  */
export default class ParticlePool {
  /** @Constructor
    * Initializes core variables and manually allocates memory for the particle's variables.
    * @param {int} maxSize - maximum size of the array. Array size never changes.
    * @param {string} color - name of the color that the particles in the pool need to be.
    * @param {float} speed - max speed of the particles in the pool in pixels per frame.
    * Note: Each Particle contains 6 floats, to determine its behavior.
    */
  constructor(maxSize, color, speed) {
    this.pool = new Float32Array(6 * maxSize);
    //Keeps track the position of the first position without a particle (count - 1)
    this.end = 0;
    this.max = maxSize;
    this.color = color;
    this.speed = speed;
  }

  /** @Function add()
    * Handles adding a new particle to the pool.
    * @param {floats} x, y - position variables
    * @param {float} direction - direction the particles travel
    * @param {float} decay - how much the particle's speed decreases each frame. Gives the particles a much smoother look.
    * @param {float} life - determines how many frames a particle will last. But some noise is added to this number for a less stiff look. 1.0 = 10 frames = 1/6 of a second @ 60fps
    */
  add(x, y, direction, decay, life) {
    //Random speed off the max speed
    let randSpeed = Math.randomInt(1, this.speed);
    //Determine x & y velocities based on the direction & speed
    let vx = Math.sin(direction) * randSpeed;
    let vy = -Math.cos(direction) * randSpeed;
    //Add some noise to the life
    let lifeNoise = life + Math.randomBetween(-0.5, 0.5);
    if(this.end < this.max) {
      //Calculate the index
      let i = 6 * this.end;
      this.pool[i] = x;
      this.pool[i + 1] = y;
      this.pool[i + 2] = vx;
      this.pool[i + 3] = vy;
      this.pool[i + 4] = decay;
      this.pool[i + 5] = lifeNoise;
      this.end++;
    }
  }

  /** @Function update()
    * Updates all the particles currently in the object pool & removes the ones that run out of life
    */
  update() {
    for(let i = 0; i < this.end; i++) {
      //Calculate the real index
      let I = 6 * i;
      //Update X
      this.pool[I] += this.pool[I + 2];
      //Update Y
      this.pool[I + 1] += this.pool[I + 3];
      //Decay X & Y velocities if their speed is greater that 0. I + 4 -> gets the decay for that particle
      if(Math.abs(this.pool[I + 2]) > 0) {
        if(this.pool[I + 2] > 0) {
          this.pool[I + 2] += this.pool[I + 4];
        }
        else {
          this.pool[I + 2] -= this.pool[I + 4];
        }
      }
      if(Math.abs(this.pool[I + 3]) > 0) {
        if(this.pool[I + 3] > 0) {
          this.pool[I + 3] += this.pool[I + 4];
        }
        else {
          this.pool[I + 3] -= this.pool[I + 4];
        }
      }
      //Decrement life. 1.0 = 10 frames of life
      this.pool[I + 5] -= 0.1;

      //Check if the life ran out
      if(this.pool[I + 5] <= 0.0) {
        //Swap dead particle with the alive one.
        let last = 6 * (this.end - 1);
        this.pool[I] = this.pool[last];
        this.pool[I + 1] = this.pool[last + 1];
        this.pool[I + 2] = this.pool[last + 2];
        this.pool[I + 3] = this.pool[last + 3];
        this.pool[I + 4] = this.pool[last + 4];
        this.pool[I + 5] = this.pool[last + 5];
        //Update the end tracker
        this.end--;
        //Make sure the loop doesn't mess up.
        i--;
      }
    }
  }

  /** @Function render()
    * Function to draw all the particles in the object pool.
    */
  render(ctx) {
    ctx.save();
    ctx.beginPath();
    ctx.fillStyle = this.color;
    for(let i = 0; i < this.end; i ++) {
      ctx.moveTo(this.pool[6 * i], this.pool[6 * i + 1])
      ctx.arc(this.pool[6 * i], this.pool[6 * i + 1], 1, 0, Math.tau);
    }
    ctx.fill();
    ctx.restore();
  }
}
