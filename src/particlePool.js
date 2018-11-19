

export default class ParticlePool {
  // 6 floats -> x, y, vx, vy, decay, life
  constructor(maxSize, color, speed) {
    this.pool = new Float32Array(6 * maxSize);
    this.end = 0;
    this.max = maxSize;
    this.color = color;
    this.speed = speed;
  }

  add(x, y, direction, decay, life) {
    let randSpeed = Math.randomInt(1, this.speed);
    let vx = Math.sin(direction) * randSpeed;
    let vy = -Math.cos(direction) * randSpeed;
    let lifeNoise = life + Math.randomBetween(-0.5, 0.5);
    if(this.end < this.max) {
      this.pool[6*this.end] = x;
      this.pool[6*this.end + 1] = y;
      this.pool[6*this.end + 2] = vx;
      this.pool[6*this.end + 3] = vy;
      this.pool[6*this.end + 4] = decay;
      this.pool[6*this.end + 5] = lifeNoise;
      this.end++;
    }
  }

  update() {
    for(let i = 0; i < this.end; i++) {
      let I = 6 * i;
      //Update X
      this.pool[I] += this.pool[I + 2];
      //Update Y
      this.pool[I + 1] += this.pool[I + 3];
      //Decay X & Y velocities
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
      //Decrement life
      this.pool[I + 5] -= 0.1;

      if(this.pool[I + 5] <= 0) {
        let last = 6 * (this.end - 1);
        this.pool[I] = this.pool[last];
        this.pool[I + 1] = this.pool[last + 1];
        this.pool[I + 2] = this.pool[last + 2];
        this.pool[I + 3] = this.pool[last + 3];
        this.pool[I + 4] = this.pool[last + 4];
        this.pool[I + 5] = this.pool[last + 5];
        this.end--;
        i--;
      }
    }
  }

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
