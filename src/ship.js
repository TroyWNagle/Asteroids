import Particle from './particles.js';


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
    //Velocity to determine the magnitude/direction of the ship
    this.velocity = {mag: 0.0, dir: 0.0};
    this.speed = {x: 0.0, y: 0.0};
    this.radius = 15;
    //particles for thruster trail
    this.particles = [];
    this.color = 'green';
    this.powerups = {homing: false};
    this.powerupTimers = {hTimer: 0}
  }

  /** @function updateSpeed()
    * Handles the updating of the player's ship and enforces the speed limit
    */
  updateSpeed() {
    //Alter the direction
    this.speed.y += -Math.cos(this.velocity.dir) * this.velocity.mag;
    this.speed.x += Math.sin(this.velocity.dir) * this.velocity.mag;
    //Enforce the max x speed
    if(Math.abs(this.speed.x) >= 3.0) {
      if(this.speed.x < 0) {
        this.speed.x = -3.0;
      }
      else {
        this.speed.x = 3.0;
      }
    }
    //Enfore the max y speed
    if(Math.abs(this.speed.y) >= 3.0) {
      if(this.speed.y < 0) {
        this.speed.y = -3.0;
      }
      else {
        this.speed.y = 3.0;
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
    var x = this.x - Math.sin(this.velocity.dir)* this.radius;
    var y = this.y + Math.cos(this.velocity.dir)* this.radius;
    for(var i = 0; i < numParticles; i++) {
      //Create some noise on the starting position
      var dx = x + Math.randomBetween(-3, 3);
      var dy = y + Math.randomBetween(-3, 3);
      //Create new Particle
      this.particles.push(new Particle(dx, dy, Math.PI * this.velocity.dir, 2.0, 'red', 20));
    }
  }

  /** @function update()
    * handles the updating of the ships position and the particles tied to its trail
    */
  update() {
    this.edgeDetection();
    this.x += this.speed.x;
    this.y += this.speed.y;
    if(this.powerups.homing) {
      this.powerupTimers.hTimer--;
      if(this.powerupTimers.hTimer <= 0) {
        this.powerups.homing = false;
      }
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
    * function to draw the ship and the particles for the thruster trail
    * @param context ctx - the backBufferContext from game.js
    */
  render(ctx) {
    ctx.save()
    ctx.strokeStyle = this.color;
    ctx.beginPath();
    //Enable accurate rotation
    ctx.translate(this.x, this.y);
    ctx.rotate(this.velocity.dir);
    //Draw ship
    ctx.moveTo(0, -this.radius);
    ctx.lineTo(10, this.radius);
    ctx.lineTo(0, this.radius / 1.5);
    ctx.lineTo(-10, this.radius);
    ctx.lineTo(0, -this.radius);
    ctx.stroke();
    ctx.restore();
    //Render particles
    this.particles.forEach(particle => {
      particle.render(ctx);
    });
  }
}
