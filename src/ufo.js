import Ship from './ship.js';

/** @class UFO
  * Class to handle the UFO, inherits from the Ship class
  */
export default class UFO extends Ship {
  /** @constructor
    * Handles the initialization of the UFO
    * @param {floats} x, y - position variables.
    * Note: Right now color & type do the same thing, but I have both in case I want to change the colors of the UFOs or add new ones.
    */
  constructor(x, y) {
    super();
    //UFOs don't have boost, no need to have an object pool for them.
    this.boostParticles = null;
    this.x = x;
    this.y = y;
    //Determines the spinning of the UFO
    this.rotation = 0.0;
    this.accel = {mag: 0.0, dir: 0.0}
    this.acceleration = 0.2;
    //Reference to an asteroid if the UFO ever catches one.
    this.asteroid = '';
    //For visual
    this.innerRadius = 10;
    //For the actual size of the ship
    this.radius = 25;
    //For the area around the ship the UFO tries to keep empty
    this.bufferRadius = 75;
    //When the Ship is in critical danger
    this.critical = 40;
    //Color of the UFO
    this.color = "";
    //A.I. type of the UFO (tied to color)
    this.type = "";
    //Cooldown timer for pathfinding & abilities.
    this.clock = 0;
    //Points given to the play upon death.
    this.bounty = 0;
    this.setColor();
    //Adjust the object pool for the UFO
    this.normalParticles.color = this.color;
    this.normalParticles.speed = 1.0;
    this.setClock();
    this.rateOfFire = 0;
    this.setRateOfFire();
    //For visual
    this.lineSegments = [];
    this.initLineSegments();
    //Goal position of the UFO. UFOs do not always have one.
    this.goal = '';
    this.initVelocity();
  }

  /** @Function setColor()
    * Chooses a random color & sets the variables tied to color
    */
  setColor() {
    let color;
    let random = Math.randomInt(0, 101);
    //Spawn UFO and reset Timer
    if(random > 90) {
      //Elite UFOs can do anything other UFOs can & are more aggressive. They also give a life when they are destroyed.
      color = 'fuchsia';
      this.type = "Elite";
      this.bounty = 500;
    }
    else if(random > 85) {
      //Dodger UFOs have the fastest fire rate (behind Elite) & will attempt to dodge projectiles.
      color = 'purple';
      this.type = "Dodger";
      this.bounty = 200;
    }
    else if (random > 45) {
      //Hurler UFOs will catch smallish asteroids & throw them in the direction of the player.
      color = 'blue';
      this.type = "Hurler";
      this.bounty = 150;
    }
    else {
      //Theif UFOs will try to steal power ups that spawn from the player.
      color = 'orange';
      this.bounty = 100;
      this.type = "Theif";
    }
    this.color = color;
  }

  /** @Function setClock()
    * determines the clock based on the type of UFO. Mainly handles pathfinding & projectile dodging.
    */
  setClock() {
    this.CLOCK = 0;
    if(this.type === 'Dodger') {
      this.CLOCK = 5;
      this.clock = this.CLOCK;
    }
    else if(this.type === 'Elite') {
      this.CLOCK = 1;
      this.clock = this.CLOCK;
    }
    else if(this.type === 'Hurler') {
      this.CLOCK = 30;
      this.clock = this.CLOCK;
    }
    else {
      this.CLOCK = 60;
      this.clock = this.CLOCK;
    }
  }

  /** @Funciton setRateOfFire()
    * Handles setting the rate of fire based on the UFO type.
    */
  setRateOfFire() {
    if(this.type === 'Dodger') {
      this.rateOfFire = Math.randomInt(150, 350);
    }
    else if(this.type === 'Elite') {
      this.rateOfFire = Math.randomInt(75, 150);
    }
    else if(this.type === 'Hurler') {
      this.rateOfFire = Math.randomInt(300, 700);
    }
    else {
      this.rateOfFire = Math.randomInt(300, 500);
    }
    //Check if the UFO has the rapid fire power up.
    if(this.powerups[2]) {
      this.rateOfFire = Math.round(this.rateOfFire / 2)
    }
  }

  /** @function initLineSegments()
    * handles the creation of endpoints to draw lines on the UFO
    */
  initLineSegments() {
    let xi;
    let xf;
    let yi;
    let yf;
    // 60 degress per segment, (PI / 3)
    let numSegments = 6;
    for(let i = 0; i < numSegments; i++) {
      //Calculate various sin and cos values
      let cos = Math.cos(i * Math.PI / 3);
      let sin = Math.sin(i * Math.PI / 3);
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
    * Handles the initial Goal of the UFO to get on screen.
    */
  initVelocity() {
    this.goal = {x: Math.randomBetween(200, 800), y: Math.randomBetween(200, 800)};
  }

  /** @Function updateSpeed()
    * Handles the updating of speed of the UFO & enforces the speed limit.
    */
  updateSpeed() {
    //Adjust based on the acceleration vector.
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
    * Handles what the UFO does when it gets close to the edge of the screen. UFOs like to stay on screen once they get there.
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

  /** @Function goToGoal()
    * Handles how a UFO approaches its goal position.
    * Note: Unlike the player, the UFO can go in what ever direciton it likes immediately, but it still has to accelerate in that direction.
    */
  goToGoal() {
    let distance = Math.getDistance(this.x, this.y, this.goal.x, this.goal.y);
    this.accel.dir = Math.getDir(distance, this.x, this.y, this.goal.x, this.goal.y);
    this.accel.mag = this.acceleration;
    //If it is less than its radius away from its goal, it has made it.
    if(distance < this.radius) {
      this.goal = '';
    }
  }

  /** @Function alterPath()
    * Handles how the UFO dodges asteroids.
    * @param {float} direction - direction the UFO needs to try to go.
    * Note: If the UFO has a goal while dodging an asteroid, it must wait on its clock to start going towards its goal again.
    * This is to prevent, UFOs from just trying to slam them selves into asteroids, give different UFOs seemingly different behaviors, &
    * given the player potentially a better chance of beating the UFO to the power up.
    */
  alterPath(direction) {
    this.accel.mag = this.acceleration;
    this.accel.dir = direction;
    if(this.goal !== '') {
      //This is so it doesn't get pushed to zero by dodging a lot
      this.setClock();
      this.clock--;
    }
  }

  /** @Function catchAsteroid()
    * Handles how the UFO manipulates an asteroid when trying to catch it.
    * @param {asteroid} asteroid - Reference to the asteroid the UFO is trying to catch.
    * Note: When asteroids are held, they are treated as being 5 times more massive than they actually are.
    * This is to prevent asterods from overlapping when held asteroids collide with other asteroids.
    */
  catchAsteroid(asteroid) {
    //Make sure the UFO has a reference to its new Asteroid
    this.asteroid = asteroid
    //Make sure the Asteroid knows it is being held
    this.asteroid.held = true;
    //Lock the speed of the Asteroid with the speed of the UFO.
    this.asteroid.velocity.x = this.speed.x;
    this.asteroid.velocity.y = this.speed.y;
  }

  /** @Function orbitAsteroid()
    * Handles making the held asteroid orbit the UFO.
    */
  orbitAsteroid() {
    //Get the Distance the Asteroid is from the UFO
    let distance = Math.getDistance(this.x, this.y, this.asteroid.x, this.asteroid.y);
    //Get the direction fro the UFO to the Asteroid.
    let direction = Math.getDir(distance, this.x, this.y, this.asteroid.x, this.asteroid.y);
    //How much the UFO wants to spin the Asteroid
    let delta = 0.02;
    //Calculate where the new position of the asteroid needs to be.
    let x = this.x + Math.sin(direction + delta) * distance;
    let y = this.y - Math.cos(direction + delta) * distance;
    //Update the position.
    this.asteroid.x = x;
    this.asteroid.y = y;
  }

  /** @Function checkAsteroidAlignment()
    * Handles how the UFO lines up the Asteroid held with the player.
    * @param {Ship} player - reference to the player.
    */
  checkAsteroidAlignment(player) {
    //Direction of the UFO to the Asteroid.
    let direction = Math.getDirection(this.x, this.y, this.asteroid.x, this.asteroid.y);
    //Direction of the UFO to the Player.
    let aim = Math.getDirection(this.x, this.y, player.x, player.y);
    //Calculate how much the angles are off by
    let error = direction - aim;
    //If it is only off by 5 degrees throw the asteroid
    if(Math.abs(error) < 5 * Math.PI / 180) {
      //How fast the asteroid is thrown is based on the mass of the asteroid.
      let magnitude = 30 / this.asteroid.mass;
      /* Why the hell is this here?
      this.speed.y += -Math.cos(this.accel.dir) * this.accel.mag;
      this.speed.x += Math.sin(this.accel.dir) * this.accel.mag;*/
      //update the velocity of theh asteroid
      this.asteroid.velocity.x = Math.sin(direction) * magnitude;
      this.asteroid.velocity.y = -Math.cos(direction) * magnitude
      //Make sure it knows it isn't held any more.
      this.asteroid.held = false;
      //Get rid of the reference.
      this.asteroid = '';
    }
  }

  /** @function createParticles()
    * function to handle creating the particles for the thruster trail
    * @param int numParticles - number of particles to be created
    */
  createParticles(numParticles) {
    for(let i = 0; i < numParticles; i++) {
      let angle = this.velocity.dir + Math.randomBetween(-Math.PI, 0);
      let x = this.x - Math.cos(angle) * this.radius;
      let y = this.y + Math.sin(angle) * this.radius;
      //Create new Particle
      this.normalParticles.add(x, y, this.velocity.dir + Math.PI, -0.05, 3.0);
      //this.particles.push(new Particle(x, y, Math.PI + this.velocity.dir, 0.70 * this.velocity.mag, this.color, 30, true));
    }
  }

  /** @Function asteroidParticles()
    * Handles the creation of particles for held asteroids.
    * @param {int} numParticles - number of particles that need to be created.
    */
  asteroidParticles(numParticles) {
    let x = this.asteroid.x;
    let y = this.asteroid.y;
    for(let i = 0; i < numParticles; i++) {
      let angle = Math.randomBetween(0, Math.tau);
      //Get a point on the asteroid's surface
      let dx = x + Math.cos(angle) * this.asteroid.radius;
      let dy = y - Math.sin(angle) * this.asteroid.radius;

      this.normalParticles.add(dx, dy, angle, -0.05, 3.0);
    }
  }

  /** @Function checkPowerUps()
    * Handles updating the power ups that the UFO has active.
    */
  checkPowerUps() {
    for(let i = 1; i <= 3; i++) {
      if(this.powerups[i]) {
        this.powerupTimers[i]--;
        if(this.powerupTimers[i] <= 0) {
          this.powerups[i] = false;
        }
      }
    }
  }

  /** @function update()
    * Updates everything that needs to be changed on a frame by frame basis.
    */
  update() {
    this.edgeDetection();
    this.updateSpeed();
    this.checkPowerUps();
    super.updateVelocity();

    //Update clock
    if(this.clock < this.CLOCK) {
      this.clock--;
      if(this.clock <= 0) {
        this.setClock();
      }
    }
    //Slow down path finding
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
    //Rotation the UFO visually
    if(this.speed.x > 0) {
      this.rotation += 0.01;
    }
    else {
      this.rotation -= 0.01;
    }
    //Check if it has a held asteroid
    if(this.asteroid !== '') {
      let dist = Math.getDistance(this.x, this.y, this.asteroid.x, this.asteroid.y);
      //Make sure it is still withint range & not destroyed
      if(!this.asteroid.held || dist > this.bufferRadius + this.asteroid.radius) {
        this.asteroid.held = false;
        this.asteroid = '';
      }
      else {
        //Orbit the asteroid & create a particle effect.
        this.asteroid.velocity.x = this.speed.x;
        this.asteroid.velocity.y = this.speed.y;
        this.orbitAsteroid();
        this.asteroidParticles(1);
      }
    }
    //Update the position
    this.x += this.speed.x;
    this.y += this.speed.y;
    //Create particles for the particle trail
    if(Math.random() > 0.50) {
      this.createParticles(1);
    }
    //Update object pool
    this.normalParticles.update();
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
    ctx.arc(0, 0, this.innerRadius, 0, Math.tau);
    ctx.closePath();
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, 0, this.radius, 0, Math.tau);
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
    this.normalParticles.render(ctx);
    //Draw the shield if need be.
    if(this.powerups[3]) {
      super.drawShield(ctx);
    }
  }
}
