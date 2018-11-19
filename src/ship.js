
import ParticlePool from './particlePool.js';
import BoostBar from './boostBar.js';
import PowerUpDisplay from './powerUpTimer.js';


/** @class Ship
  * Class that handles everything ship related, Super class of UFO
  */
export default class Ship {
  /** @constructor
    * Handles the initialization of a ship object
    */
  constructor() {
    //position of the center of the Ship
    this.x = 500;
    this.y = 500;
    this.RATE = 40;
    this.reloading = false;
    this.rateOfFire = this.RATE;
    //Velocity to determine the magnitude/direction of the ship
    //This is actually acceleration...
    this.accel = {mag: 0.1, dir: 0.0};
    this.velocity = {mag: 0.0, dir: 0.0};
    this.speed = {x: 0.0, y: 0.0};
    this.radius = 15;
    //particles for thruster trail
    this.particles = [];
    //size, color, speed
    this.boostParticles = new ParticlePool(210, 'blue', 3.0);
    this.normalParticles = new ParticlePool(80, 'red', 2.0);
    this.color = 'green';
    this.MAXBOOST = 120;
    this.boosting = false;
    this.boost = 120;
    this.boostRecharge = 1;
    this.TOPSPEED = 3.0;
    // 1 = homing, 2 = rapid fire
    this.powerups = {1: false, 2: false, 3: false};
    this.powerupTimers = {1: 0, 2: 0, 3: 0};
    this.powerUpDisplays = {1: '', 2: '', 3: ''};
    this.boostGauge = new BoostBar(this.boost, this.MAXBOOST);
  }

  /** @function updateSpeed()
    * Handles the updating of the player's ship and enforces the speed limit
    */
  updateSpeed(acceleration) {
    //Alter the direction
    this.speed.y += -Math.cos(this.accel.dir) * acceleration;
    this.speed.x += Math.sin(this.accel.dir) * acceleration;
    //Enforce the max x speed
    if(Math.abs(this.speed.x) >= this.TOPSPEED) {
      if(this.speed.x < 0) {
        this.speed.x = -this.TOPSPEED;
      }
      else {
        this.speed.x = this.TOPSPEED;
      }
    }
    //Enfore the max y speed
    if(Math.abs(this.speed.y) >= this.TOPSPEED) {
      if(this.speed.y < 0) {
        this.speed.y = -this.TOPSPEED;
      }
      else {
        this.speed.y = this.TOPSPEED;
      }
    }
  }

  /** @function edgeDetection()
    * function to handle the player's ship passing the edge of the screen, wraps back around
    */
  edgeDetection() {
    if(this.x <= -this.radius) {
      this.x = 1000;
    }
    if(this.y <= -this.radius) {
      this.y = 1000;
    }
    if(this.x >= 1000 + this.radius) {
      this.x = 0;
    }
    if(this.y >= 1000 + this.radius) {
      this.y = 0;
    }
  }

  /** @function createParticles()
    * function to handle creating the particles for the thruster trail
    * @param int numParticles - number of particles to be created
    */
  createParticles(numParticles) {
    //Get position of the back of the ship
    let x = this.x - Math.sin(this.accel.dir) * this.radius;
    let y = this.y + Math.cos(this.accel.dir) * this.radius;
    for(let i = 0; i < numParticles; i++) {
      //Create some noise on the starting position
      let dx = x + Math.randomBetween(-3, 3);
      let dy = y + Math.randomBetween(-3, 3);
      //0.0872665 is 5 degrees in radians
      let angleNoise = this.accel.dir + Math.randomBetween(-0.0872665 * 2, 0.0872665 * 2)
      //Create new Particle
      if(this.boosting && this.boost > 0) {
        this.boostParticles.add(dx, dy, Math.PI + angleNoise, -0.05, 3.5);
        //this.particles.push(new Particle(dx, dy, Math.PI + angleNoise, 3.0, 'blue', 35, true));
      }
      else {
        this.normalParticles.add(dx, dy, Math.PI + angleNoise, -0.05, 2.0);
        //this.particles.push(new Particle(dx, dy, Math.PI + angleNoise, 2.0, 'red', 20, true));
      }
    }
  }

  checkPowerUps() {
    for(let i = 1; i <= 3; i++) {
      if(this.powerups[i]) {
        this.powerupTimers[i]--;
        this.powerUpDisplays[i].timer--;
        if(this.powerupTimers[i] <= 0) {
          this.powerups[i] = false;
          this.powerUpDisplays[i] = '';
        }
      }
    }
  }

  updateVelocity() {
    let mag = Math.sqrt(this.speed.x * this.speed.x + this.speed.y * this.speed.y);
    let angle = Math.acos(this.speed.y / mag);
    if(this.speed.x < 0) {
      angle *= -1;
    }
    if(angle < 0) {
      angle += Math.tau
    }
    this.velocity.mag = mag;
    this.velocity.dir = angle;
  }

  /** @function update()
    * handles the updating of the ships position and the particles tied to its trail
    */
  update() {
    this.edgeDetection();
    this.x += this.speed.x;
    this.y += this.speed.y;
    this.updateVelocity();
    this.checkPowerUps();
    //Controlling the rate of fire
    if(this.reloading) {
      this.rateOfFire--;
      if(this.rateOfFire <= 0) {
        if(this.powerups[2]) {
          this.rateOfFire = this.RATE / 2
        }
        else {
          this.rateOfFire = this.RATE;
        }
        this.reloading = false;
      }
    }

    if(!this.boosting && this.boost < this.MAXBOOST) {
      this.boostRecharge *= -1;
      //Variable makes it so the boost only recharges every other frame.
      if(this.boostRecharge === 1) {
        this.boost++;
        this.boostGauge.boost = this.boost;
      }
    }

    //Particle effect for the thruster
    /*for(let j = 0; j < this.particles.length; j++) {
      this.particles[j].update();
      if(this.particles[j].life <= 0) {
        //delete this.particles[j];
        this.particles.splice(j, 1);
      }
    }*/
    this.boostParticles.update();
    this.normalParticles.update();
    this.boostGauge.update();
  }

  drawShield(ctx) {
    ctx.save();
    ctx.fillStyle = 'magenta';
    ctx.globalAlpha = 0.1;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius * 1.3, 0, Math.tau);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  createPowerUpDisplay(type, timer) {
    if(type === 1) {
      this.powerUpDisplays[type] = new PowerUpDisplay(5, 1000 * 0.40, type, timer);
    }
    else if(type === 2) {
      this.powerUpDisplays[type]= new PowerUpDisplay(5, 1000 * 0.50, type, timer);
    }
    else {
      this.powerUpDisplays[type] = new PowerUpDisplay(5, 1000 * 0.60, type, timer);
    }
  }

  updatePowerUpDisplay(type, amount) {
    this.powerUpDisplays[type].timer += amount;
  }

  /** @function render()
    * function to draw the ship and the particles for the thruster trail
    * @param context ctx - the backBufferContext from game.js
    */
  render(ctx) {
    for(let i = 1; i < 4; i ++) {
      if(this.powerUpDisplays[i] !== '') {
        this.powerUpDisplays[i].render(ctx);
      }
    }
    ctx.save()
    ctx.strokeStyle = this.color;
    ctx.beginPath();
    //Enable accurate rotation
    ctx.translate(this.x, this.y);
    ctx.rotate(this.accel.dir);
    //Draw ship
    ctx.moveTo(0, -this.radius);
    ctx.lineTo(10, this.radius);
    ctx.lineTo(0, this.radius / 1.5);
    ctx.lineTo(-10, this.radius);
    ctx.lineTo(0, -this.radius);
    ctx.stroke();
    ctx.restore();
    //Render particles
    /*this.particles.forEach(particle => {
      particle.render(ctx);
    });*/
    this.boostParticles.render(ctx);
    this.normalParticles.render(ctx);
    if(this.powerups[3]) {
      this.drawShield(ctx);
    }
    this.boostGauge.render(ctx);
  }
}
