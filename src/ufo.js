import Ship from './ship.js';

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
    this.bounty = 0;
    this.setColor();
    this.rateOfFire = 0;
    this.setRateOfFire();
    //For visual
    this.lineSegments = [];
    this.initLineSegments();
    this.goal = '';
    this.initVelocity();
    //1 second, delay on when to start seeking out the goal again
    this.clock = 60;
  }

  setColor() {
    var color;
    var random = Math.randomInt(0, 101);
    //Spawn UFO and reset Timer
    if(random > 80) {
      color = 'purple';
      this.bounty = 200;
    }
    else if (random > 50) {
      color = 'blue';
      this.bounty = 150;
    }
    else {
      color = 'orange';
      this.bounty = 100;
    }
    this.color = color;
  }

  setRateOfFire() {
    if(this.color === 'purple') {
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
      this.accel.dir += Math.PI
      this.accel.mag = 0.0
    }
    if((this.y + this.bufferRadius >= 1000 && this.speed.y > 0) || (this.y - this.bufferRadius <= 0 && this.speed.y < 0)) {
      this.speed.y *= -1
      this.accel.dir += Math.PI
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
      this.clock = 60;
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
    if(Math.abs(error) < 5 * Math.PI / 180 && Math.random() > 0.5) {
      let magnitude = 30 / this.asteroid.mass;
      this.speed.y += -Math.cos(this.accel.dir) * this.accel.mag;
      this.speed.x += Math.sin(this.accel.dir) * this.accel.mag;
      this.asteroid.velocity.x = Math.sin(direction) * magnitude;
      this.asteroid.velocity.y = -Math.cos(direction) * magnitude
      this.asteroid = '';
    }
  }

  /** @function update()
    * standard position / speed update function
    */
  update() {
    this.edgeDetection();
    this.updateSpeed();
    super.checkPowerUps();
    if(this.clock < 60) {
      this.clock--;
      if(this.clock <= 0) {
        this.clock = 60;
      }
    }
    if(this.clock === 60 && this.goal !== '') {
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
      this.velocity.dir += 0.01;
    }
    else {
      this.velocity.dir -= 0.01;
    }
    if(this.asteroid !== '') {
      if(this.asteroid.destroyed) {
        this.asteroid = '';
      }
      else {
        this.asteroid.velocity.x = this.speed.x;
        this.asteroid.velocity.y = this.speed.y;
        this.orbitAsteroid();
      }
    }
    this.x += this.speed.x;
    this.y += this.speed.y;
  }

 /** @function render()
  * standard render function
  */
  render(ctx) {
    ctx.save();
    ctx.strokeStyle = this.color;
    ctx.translate(this.x, this.y);
    ctx.rotate(this.velocity.dir);
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
  }
}
