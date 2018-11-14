import Ship from './ship.js';
import Particle from './particles.js';

/** @class UFO
  * Class to handle the UFO, inherits from the Ship class
  */
export default class UFO extends Ship {
  /** @constructor
    * Handles the initialization of the UFO
    */
  constructor(x, y) {
    super();
    this.x = x;
    this.y = y;
    this.rotation = 0.0;
    this.accel = {mag: 0.0, dir: 0.0}
    this.acceleration = 0.2;
    this.asteroid = '';
    //For visual
    this.innerRadius = 10;
    //For the actual size of the ship
    this.radius = 25;
    //For the area around the ship the UFO tries to keep empty
    this.bufferRadius = 60;
    //When the Ship is on the verge of crashing into an asteroid, it shoots to destory it
    this.critical = 40;
    this.color = "";
    this.clock = 0;
    this.bounty = 0;
    this.setColor();
    this.setClock();
    this.rateOfFire = 0;
    this.setRateOfFire();
    //For visual
    this.lineSegments = [];
    this.initLineSegments();
    this.goal = '';
    this.initVelocity();
    //1 second, delay on when to start seeking out the goal again
  }

  setColor() {
    var color;
    var random = Math.randomInt(0, 101);
    //Spawn UFO and reset Timer
    if(random > 90) {
      color = 'fuchsia';
      this.bounty = 500;
    }
    else if(random > 85) {
      color = 'purple';
      this.bounty = 200;
    }
    else if (random > 45) {
      color = 'blue';
      this.bounty = 150;
    }
    else {
      color = 'orange';
      this.bounty = 100;
    }
    this.color = color;
  }

  setClock() {
    this.CLOCK = 0;
    if(this.color === 'purple' || this.color === 'fuchsia') {
      this.CLOCK = 5;
      this.clock = this.CLOCK;
    }
    else if(this.color === 'blue') {
      this.CLOCK = 30;
      this.clock = this.CLOCK;
    }
    else {
      this.CLOCK = 60;
      this.clock = this.CLOCK;
    }
  }

  setRateOfFire() {
    if(this.color === 'purple' || this.color === 'fuchsia') {
      this.rateOfFire = Math.randomInt(150, 350);
    }
    else if(this.color === 'blue') {
      this.rateOfFire = Math.randomInt(300, 700);
    }
    else {
      this.rateOfFire = Math.randomInt(300, 500);
    }
    if(this.powerups[2]) {
      this.rateOfFire = Math.round(this.rateOfFire / 2)
    }
  }

  /** @function initLineSegments()
    * handles the creation of endpoints to draw lines on the UFO
    */
  initLineSegments() {
    var xi;
    var xf;
    var yi;
    var yf;
    // 60 degress per segment, (PI / 3)
    var numSegments = 6;
    for(var i = 0; i < numSegments; i++) {
      //Calculate various sin and cos values
      var cos = Math.cos(i * Math.PI / 3);
      var sin = Math.sin(i * Math.PI / 3);
      //Set x values based on cos * radius values
      xi = cos * this.innerRadius;
      xf = cos * this.radius;
      //Set y values based on - sin * radius values
      yi = -sin * this.innerRadius;
      yf = -sin * this.radius;
      this.lineSegments.push({xI: xi, xF: xf, yI: yi, yF: yf});
    }
  }

  /** @function initVelocity()
    * Handles the initVelocity of the UFO
    */
  initVelocity() {
    this.goal = {x: Math.randomBetween(200, 800), y: Math.randomBetween(200, 800)};
  }

  updateSpeed() {
    //Alter the direction
    this.speed.y += -Math.cos(this.accel.dir) * this.accel.mag;
    this.speed.x += Math.sin(this.accel.dir) * this.accel.mag;
    //Enforce the max x speed
    if(Math.abs(this.speed.x) >= 1.5) {
      if(this.speed.x < 0) {
        this.speed.x = -1.5;
      }
      else {
        this.speed.x = 1.5;
      }
    }
    //Enfore the max y speed
    if(Math.abs(this.speed.y) >= 1.5) {
      if(this.speed.y < 0) {
        this.speed.y = -1.5;
      }
      else {
        this.speed.y = 1.5;
      }
    }
  }

  /** @function edgeDetection()
    * function to handle the asteroid leaving the edge of the screen,  slightly different than player ship since it is okay for it to be off screen
    * Side note - UFO is much more vulnerable to asteroids off screen, cannot shoot to protect itself (though it will try) and asteroids switching sides may instantly destory it
    */
  edgeDetection() {
    if((this.x + this.bufferRadius >= 1000 && this.speed.x > 0) || (this.x - this.bufferRadius <= 0 && this.speed.x < 0)) {
      this.speed.x *= -1
      this.accel.dir += Math.PI / 2
      this.accel.mag = 0.0
    }
    if((this.y + this.bufferRadius >= 1000 && this.speed.y > 0) || (this.y - this.bufferRadius <= 0 && this.speed.y < 0)) {
      this.speed.y *= -1
      this.accel.dir += Math.PI / 2
      this.accel.mag = 0.0
    }
  }

  checkCollisions(asteroids, x, y) {
    for(let j = 0; j < asteroids.length; j++) {
      if(Math.circleCollisionDetection(x, y, this.critical, asteroids[j].x, asteroids[j].y, asteroids[j].radius)) {
        return true;
      }
    }
    return false;
  }

  goToGoal() {
    this.accel.dir = Math.getDirection(this.x, this.y, this.goal.x, this.goal.y);
    this.accel.mag = this.acceleration;
    let distance = Math.getDistance(this.x, this.y, this.goal.x, this.goal.y);
    if(distance < this.radius) {
      this.goal = '';
    }
  }

  alterPath(direction) {
    this.accel.mag = this.acceleration;
    this.accel.dir = direction;
    if(this.goal !== '') {
      //This is so it doesn't get pushed to zero by dodging a lot
      this.setClock();
      this.clock--;
    }
  }

  catchAsteroid(asteroid) {
    this.asteroid = asteroid
    this.asteroid.velocity.x = this.speed.x;
    this.asteroid.velocity.y = this.speed.y;
  }

  orbitAsteroid() {
    let direction = Math.getDirection(this.x, this.y, this.asteroid.x, this.asteroid.y);
    let distance = Math.getDistance(this.x, this.y, this.asteroid.x, this.asteroid.y)
    let delta = 0.02;
    let x = this.x + Math.sin(direction + delta) * distance;
    let y = this.y - Math.cos(direction + delta) * distance;
    this.asteroid.x = x;
    this.asteroid.y = y;
  }

  checkAsteroidAlignment(player) {
    let direction = Math.getDirection(this.x, this.y, this.asteroid.x, this.asteroid.y);
    let aim = Math.getDirection(this.x, this.y, player.x, player.y);
    let error = direction - aim;
    //If it is only off my 5 degrees
    if(Math.abs(error) < 5 * Math.PI / 180) {
      let magnitude = 30 / this.asteroid.mass;
      this.speed.y += -Math.cos(this.accel.dir) * this.accel.mag;
      this.speed.x += Math.sin(this.accel.dir) * this.accel.mag;
      this.asteroid.velocity.x = Math.sin(direction) * magnitude;
      this.asteroid.velocity.y = -Math.cos(direction) * magnitude
      this.asteroid = '';
    }
  }

  /** @function createParticles()
    * function to handle creating the particles for the thruster trail
    * @param int numParticles - number of particles to be created
    */
  createParticles(numParticles) {
    for(var i = 0; i < numParticles; i++) {
      var angle = this.velocity.dir + Math.randomBetween(-Math.PI, 0);
      var x = this.x - Math.cos(angle) * this.radius;
      var y = this.y + Math.sin(angle) * this.radius;
      //Create new Particle
      this.particles.push(new Particle(x, y, Math.PI + this.velocity.dir, 0.70 * this.velocity.mag, this.color, 30));
    }
  }

  asteroidParticles(numParticles) {
    let x = this.asteroid.x;
    let y = this.asteroid.y;
    for(let i = 0; i < numParticles; i++) {
      let angle = Math.randomBetween(0, Math.PI * 2);
      //Get a poin on the asteroid's surface
      let dx = x + Math.cos(angle) * this.asteroid.radius;
      let dy = y - Math.sin(angle) * this.asteroid.radius;

      this.particles.push(new Particle(dx, dy, angle + Math.PI / 6, 2.0, this.color, 20));
    }
  }

  /** @function update()
    * standard position / speed update function
    */
  update() {
    this.edgeDetection();
    this.updateSpeed();
    super.checkPowerUps();
    super.updateVelocity();
    if(this.clock < this.CLOCK) {
      this.clock--;
      if(this.clock <= 0) {
        this.setClock();
      }
    }
    if(this.clock === this.CLOCK && this.goal !== '') {
      this.goToGoal();
    }
    //Controlling the rate of fire
    if(this.reloading) {
      this.rateOfFire--;
      if(this.rateOfFire <= 0) {
        this.setRateOfFire()
        this.reloading = false;
      }
    }
    if(this.speed.x > 0) {
      this.rotation += 0.01;
    }
    else {
      this.rotation -= 0.01;
    }
    if(this.asteroid !== '') {
      if(this.asteroid.destroyed) {
        this.asteroid = '';
      }
      else {
        this.asteroid.velocity.x = this.speed.x;
        this.asteroid.velocity.y = this.speed.y;
        this.orbitAsteroid();
        this.asteroidParticles(1);
      }
    }
    this.x += this.speed.x;
    this.y += this.speed.y;
    if(Math.random() > 0.50) {
      this.createParticles(1);
    }
    //Particle effect for the thruster
    for(var j = 0; j < this.particles.length; j++) {
      this.particles[j].update();
      if(this.particles[j].life <= 0) {
        this.particles.splice(j, 1);
      }
    }
  }

 /** @function render()
  * standard render function
  */
  render(ctx) {
    ctx.save();
    ctx.strokeStyle = this.color;
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    ctx.beginPath();
    ctx.arc(0, 0, this.innerRadius, 0, Math.PI * 2);
    ctx.closePath();
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
    ctx.closePath();
    ctx.stroke();
    this.lineSegments.forEach(segment => {
      ctx.beginPath();
      ctx.moveTo(segment.xI, segment.yI);
      ctx.lineTo(segment.xF, segment.yF);
      ctx.stroke();
    });
    ctx.restore();
    //Render particles
    this.particles.forEach(particle => {
      particle.render(ctx);
    });
    if(this.powerups[3]) {
      super.drawShield(ctx);
    }
  }
}
