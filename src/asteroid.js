
/** @class Asteroid
  * Class that handles the construction and data of an Asteroid
  */
export default class Asteroid {
  /** @constructor
    * Initializes all the properties of the asteroid
    * @param {floats} x, y - position of te asteroid to be created
    * @param {float} mass - mass of the asteroid, also the radius, mass to radius ratio 1:1
    * @param {float} direction - direction in radians of the asteroid's speed, -1.0 if the asteroid is being created from scratch
    */
  constructor(x, y, mass, direction) {
    //Position variables
    this.x = x;
    this.y = y;
    //Variable to help UFOs catch & release asteroids
    this.held = false;
    //if somehow this gets called with a mass less than 5
    if(mass < 5) {
      mass = 5;
    }
    this.mass = mass;
    this.radius = mass;
    //Array to store the surface of the asteroid, so it isn't a perfect circle.
    this.surfacePath = [];
    this.createSurface();
    //Used to determine the x & y velocities
    this.direction = direction;
    this.velocity = {x: 0.0, y: 0.0};
    //Used to make the asteroid spin
    this.angle = 0.0;
    //direction is not -1 if the asteroid has exploded
    if(this.direction === -1.0) {
      this.initVelocity();
    }
    else {
      this.explodedVelocity();
    }
  }

  /** @function initVelocity()
    * function to initalize the velocity of the asteroid from scratch
    */
  initVelocity() {
    //Sets speed of the asteroids, more mass = slower
    let mag = Math.randomInt(8, 10) / this.mass;
    if(this.x < 0) {
      this.velocity.x = Math.randomBetween(1.0, mag);
    }
    else if(this.x > 1000 + this.radius){
      this.velocity.x = -Math.randomBetween(1.0, mag);
    }
    else {
      this.velocity.x = Math.randomBetween(-mag, mag);
    }
    if(this.y < 0) {
      this.velocity.y = Math.randomBetween(1.0, mag);
    }
    else  if(this.y > 1000 + this.radius){
      this.velocity.y = -Math.randomBetween(1.0, mag);
    }
    else {
      this.velocity.y = Math.randomBetween(-mag, mag);
    }
  }

  /** @function createSurface()
    * function to create some 'noise' on the asteroid's surface
    */
  createSurface() {
    let segments = 24;
    //15 degree increments
    let angle = Math.tau / segments;
    let randomRadius = this.radius;
    let x;
    let y;
    for(let i = 0; i < segments; i++) {
      if(Math.randomInt(0, 100) > 70) {
        randomRadius = Math.randomBetween(this.radius * 0.80, this.radius);
      }
      x = Math.cos(i * angle) * randomRadius;
      y = -Math.sin(i * angle) * randomRadius;
      this.surfacePath.push({x: x, y: y});
    }
  }

  /** @function explodedVelocity()
    * function to initalize velocities from asteroids that have spawned from an Explosion
    */
  explodedVelocity() {
    //Sets speed of the asteroids, more mass = slower
    let mag = Math.randomInt(9, 12) / this.mass;
    //Uses the direction given to ensure the asteroids leave the center of the original asteroid
    this.velocity.x = Math.cos(this.direction) * mag;
    this.velocity.y = -Math.sin(this.direction) * mag;
  }

  /** @function edgeDetection()
    * function to handle the asteroid leaving the edge of the screen
    */
  edgeDetection() {
    //Asteroids have a buffer zone outside of the screen
    if(this.x >= 1000 + 2.5 * this.radius) {
      this.x = -2.4 * this.radius;
    }
    else if(this.x <= -2.5 * this.radius) {
      this.x = 1000 + 2.4 * this.radius;
    }
    if(this.y >= 1000 + 2.5 * this.radius) {
      this.y = -2.4 * this.radius;
    }
    else if(this.y <= -2.5 * this.radius) {
      this.y = 1000 + 2.4 * this.radius;
    }
  }

  /** @function update()
    * handles the updating of asteroids speed and position
    */
  update() {
    //Check if it needs to wrap around
    this.edgeDetection();
    //Spin left or right depending on the x speed
    if(this.velocity.x > 0) {
      this.angle += 0.01;
    }
    else {
      this.angle -= 0.01;
    }
    //Update the position
    this.x += this.velocity.x;
    this.y += this.velocity.y;
  }

  /** @function render()
    * function that handles drawing the asteroids
    * @param {canvas context} context - backBufferContext from game.js
    */
  render(context) {
    context.save();
    context.strokeStyle = 'white';
    context.translate(this.x, this.y);
    context.rotate(this.angle);
    context.beginPath();
    //Draw the noisy surface
    context.moveTo(this.surfacePath[0].x,this.surfacePath[0].y);
    for(let i = 1; i < this.surfacePath.length; i++) {
      context.lineTo(this.surfacePath[i].x, this.surfacePath[i].y);
    }
    context.closePath();
    context.stroke();
    context.restore();
  }
}
