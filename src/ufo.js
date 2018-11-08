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
    this.initVelocity();
    this.accel = {mag: 0.0, dir: 0.0}
    this.acceleration = 0.2;
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
      this.rateOfFire = Math.randomInt(500, 1000);
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
    var mag = Math.randomBetween(1, 2);
    this.speed.x = Math.randomBetween(-mag, mag);
    this.speed.y = Math.randomBetween(-mag, mag);
  }

  /** @function initPosition()
    * Handles the initial position of the UFO
    */
  initPosition() {
    var spawnSide = Math.randomInt(1, 5);
    //Top
    if(spawnSide === 1) {
      this.x = Math.randomBetween(-2 * this.radius, 1000 + 2 * this.radius);
      this.y = - 2 * this.radius;
    }
    //Right
    else if(spawnSide === 2) {
      this.x = 1000 + 2 * this.radius;
      this.y = Math.randomBetween(-2 * this.radius, 1000 + 2 * this.radius);
    }
    //Bottom
    else if(spawnSide === 3) {
      this.x = Math.randomBetween(-2 * this.radius, 1000 + 2 * this.radius);
      this.y = 1000 + 2 * this.radius;
    }
    //Left
    else {
      this.x = - 2 * this.radius;
      this.y = Math.randomBetween(-2 * this.radius, 1000 + 2 * this.radius);
    }
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
    }
    if((this.y + this.bufferRadius >= 1000 && this.speed.y > 0) || (this.y - this.bufferRadius <= 0 && this.speed.y < 0)) {
      this.speed.y *= -1
      this.accel.dir += Math.PI
    }
  }

  alterPath(direction) {
    this.accel.mag = this.acceleration;
    this.accel.dir = direction;
  }

  /** @function update()
    * standard position / speed update function
    */
  update() {
    this.edgeDetection();
    this.updateSpeed();
    super.checkPowerUps();
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
