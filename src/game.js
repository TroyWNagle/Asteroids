
import Ship from './ship.js';
import Asteroid from './asteroid.js';
import Projectile from './projectile.js';
import Homing from './homing.js';
import ParticlePool from './particlePool.js';
import UFO from './ufo.js';
import PowerUp from './powerup.js';
import PopUp from './popups.js';
import HUDObject from './hud.js';
import './math.js';

/** @class Game
  * Game object that controls the interactions between all other Objects
  */
export default class Game {
  /** @constructor
    * Game object constructor, no arguement, sets up all the necessities.
    */
  constructor(backBuffer, backBufferCanvas, screenContext, screenWidth, audioController, menu) {
    this.screenSide = screenWidth;
    this.menu = menu;
    //Absolutes
    this.MAXUFO = 5;
    this.MAXASTEROIDS = 6;
    this.UFOTIME = 500;
    this.POWERTIME = 900;
    //Num Objects
    this.numAsteroids = 3;
    //Objects/Arrays
    this.ship = new Ship();
    this.ufos = [];
    this.kills = 0;
    //Variables to control ufo spawn
    this.ufoTimer = Math.randomInt(this.UFOTIME, this.UFOTIME * 2);
    //Vars to help with respawning the player
    this.respawning = false;
    this.respawnTimer = 300;
    this.projectiles = [];
    this.asteroids = [];
    this.createAsteroids();
    this.particles = [];
    this.initParticlePools();
    //HUD Variables
    this.score = 0;
    this.highscore = 0;
    this.lives = 3;
    this.level = 1;
    this.popups = [];
    this.hudObjects = {score: '', lives: '', level: ''};
    this.initHUD();
    //Make sure there are never fewer than the inital amount of asteroids
    this.constAsteroids = this.level * this.numAsteroids;
    //controls the teleport function
    this.teleports = 10;
    this.coolingDown = 50;
    this.powerups = [];
    this.powerupTimer = Math.randomInt(this.POWERTIME, this.POWERTIME * 3);
    //Over Loop Controllers
    this.gameOver = false;
    this.paused = false;

    this.audioController = audioController;

    //Input Map
    this.keyMap = {13: false, 32: false, 37: false, 38: false, 39: false, 65: false, 68: false, 70: false, 87: false, 88: false};

    this.backBufferContext = backBuffer;
    this.backBufferCanvas = backBufferCanvas;
    this.screenBufferContext = screenContext;

    //Binders
    this.loop = this.loop.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
    window.onkeydown = this.handleKeyDown;
    window.onkeyup = this.handleKeyUp;

    //60 fps
    this.interval = setInterval(this.loop, 50/3);
  }

  /** @function masterReset()
    * This function handles the reset of eve except for the highscore, ~ to activate
    */
  masterReset() {
    //Objects/Arrays
    this.ship = new Ship();
    this.ufos = [];
    //Variables to control ufo spawn
    this.ufoTimer = Math.randomInt(this.UFOTIME, this.UFOTIME * 2);
    this.powerups = [];
    this.powerupTimer = Math.randomInt(this.POWERTIME, this.POWERTIME * 3);
    //Vars to help with respawning the player
    this.respawning = false;
    this.respawnTimer = 300;
    this.projectiles = [];
    this.asteroids = [];
    this.numAsteroids = 3;
    this.createAsteroids();
    this.particles = [];
    this.initParticlePools();
    //HUD Variables
    this.score = 0;
    this.lives = 3;
    this.level = 1;
    this.constAsteroids = this.level * this.numAsteroids;
    //controls the telepor function
    this.teleports = 10;
    this.coolingDown = 50;
    this.popups = [];
    this.hudObjects = {score: '', lives: '', level: ''};
    this.initHUD();
    //Over Loop Controllers
    this.gameOver = false;
    this.paused = false;
  }

  initParticlePools() {
    let speed = 5.0;
    let max = 140;
    this.particles.push(new ParticlePool(max, 'green', speed));
    this.particles.push(new ParticlePool(max, 'white', speed));
    this.particles.push(new ParticlePool(max, 'blue', speed));
    this.particles.push(new ParticlePool(max, 'red', speed));
    this.particles.push(new ParticlePool(max, 'fuchsia', speed));
    this.particles.push(new ParticlePool(max, 'orange', speed));
    this.particles.push(new ParticlePool(max, 'purple', speed));
  }

  /** @function handleKeyDown()
    * function to handle key presses
    */
  handleKeyDown(event) {
    event.preventDefault();
    if(event.keyCode === 80 || event.keyCode === 27) {
      this.paused = true;
      this.menu.gameState = 'paused';
      this.menu.buttonNames[0] = 'resume';
      this.menu.buttonNames[1] = 'restart';
      this.menu.buttonNames[2] = 'mute';
      this.menu.drawPauseMenu();
    }
    if(this.menu.gameState !== 'game') {
      return;
    }
    //Update the keyMap
    this.keyMap[event.keyCode] = true;
    //Handle the Pause seperately, to control the loop function
  }

  /** @function
    * function to handle the keys being lifted up
    */
  handleKeyUp(event) {
    event.preventDefault();
    //Update the key map
    this.keyMap[event.keyCode] = false;
  }

  initHUD() {
    this.hudObjects.score = new HUDObject(this.screenSide * 0.45, this.screenSide * 0.05, 'Score: ', this.score);
    this.hudObjects.lives = new HUDObject(this.screenSide * 0.03, this.screenSide * 0.97, 'Lives: ', this.lives);
    this.hudObjects.level = new HUDObject(this.screenSide * 0.87, this.screenSide * 0.97, 'Level: ', this.level);
  }

  /** @function
    * function to create a Projectile from the player's ship
    */
  createProjectile() {
    //Get the coordinates of the tip of the ship, The 1.2 is so you can't run into your own shot immediately
    let x = this.ship.x + Math.sin(this.ship.accel.dir)* this.ship.radius * 1.3;
    let y = this.ship.y - Math.cos(this.ship.accel.dir)* this.ship.radius * 1.3;
    if(this.ship.powerups[1]) {
      this.projectiles.push(new Homing(x, y, this.ship.accel.dir, this.ship.color));
      this.audioController.trigger('homing');
    }
    else {
      this.projectiles.push(new Projectile(x, y, this.ship.accel.dir, this.ship.color));
      this.audioController.trigger('shoot');
    }
    this.ship.reloading = true;
  }

  /** @function
    * function to handle UFO projectiles
    * @param float tx - is the x position of the target
    * @param float ty - is the y position of the target
    */
  ufoProjectile(ufo, tx, ty) {
    let dx = ufo.x - tx;
    let dy = ufo.y - ty;
    //Draw a line to the target
    let distance = Math.sqrt(dx * dx + dy * dy);
    //Get the direction to the target
    let direction = Math.acos(dy / distance);
    //Mirror the angle for the left hand side
    if(dx > 0) {
      direction *= -1;
    }
    //Again, 1.2 is so the ufo doesn't immediately destory itself when it shoots
    let x = ufo.x + Math.sin(direction)* ufo.radius * 1.2;
    let y = ufo.y - Math.cos(direction)* ufo.radius * 1.2;
    if(ufo.powerups[1]) {
      this.projectiles.push(new Homing(x, y, direction, ufo.color));
      this.audioController.trigger('homing');
    }
    else {
      this.projectiles.push(new Projectile(x, y, direction, ufo.color));
      this.audioController.trigger('shoot');
    }
    ufo.reloading = true;
  }

  /** @function
    * function to create as many asteroids as needed
    */
  createAsteroids() {
    while(this.asteroids.length < this.numAsteroids) {
      this.addAsteroid(-1.0);
    }
  }

  /** @function addAsteroid()
    * Function to add new asteroid to the list while making sure it is not spawned where a object already is
    * @param float direction - determines the inital direction of the asteroid if it has exploded, -1.0 if spawning in otherwise
    */
  addAsteroid(direction) {
    //Variables to establish the particle
    let x;
    let y;
    let radius;
    let mass;
    //Var to control the while loop
    let currLength = this.asteroids.length;
    //Loop that generates random values for the particle and makes sure the space is not already occupied
    while (currLength === this.asteroids.length) {
      //Var to determine if it would have spawned inside something
      var collision = false;
      let spawnSide = Math.randomInt(1, 5);
      mass = Math.randomBetween(10, 75);
      radius = mass;
      //Top
      if(spawnSide === 1) {
        x = Math.randomBetween(-2 * radius, this.screenSide + 2 * radius);
        y = - 2 * radius;
      }
      //Right
      else if(spawnSide === 2) {
        x = this.screenSide + 2 * radius;
        y = Math.randomBetween(-2 * radius, this.screenSide + 2 * radius);
      }
      //Bottom
      else if(spawnSide === 3) {
        x = Math.randomBetween(-2 * radius, this.screenSide + 2 * radius);
        y = this.screenSide + 2 * radius;
      }
      //Left
      else {
        x = - 2 * radius;
        y = Math.randomBetween(-2 * radius, this.screenSide + 2 * radius);
      }
      //Checks if the position is occupied by another asteroid
      for(let i = 0; i < currLength; i++) {
        let asteroid = this.asteroids[i];
        if(Math.circleCollisionDetection(asteroid.x, asteroid.y, asteroid.radius, x, y, radius)) {
          collision = true;
        }
      }
      if(!collision) {
        this.asteroids.push(new Asteroid(x, y, mass, direction));
      }
    }
  }

  addUFO() {
    let x;
    let y;
    let radius = 25;
    let currLength = this.ufos.length;

    while(currLength === this.ufos.length) {
      let collision = false;
      let spawnSide = Math.randomInt(1, 5);
      //Top
      if(spawnSide === 1) {
        x = Math.randomBetween(-2 * radius, 1000 + 2 * radius);
        y = - 2 * radius;
      }
      //Right
      else if(spawnSide === 2) {
        x = 1000 + 2 * radius;
        y = Math.randomBetween(-2 * radius, 1000 + 2 * radius);
      }
      //Bottom
      else if(spawnSide === 3) {
        x = Math.randomBetween(-2 * radius, 1000 + 2 * radius);
        y = 1000 + 2 * radius;
      }
      //Left
      else {
        x = - 2 * radius;
        y = Math.randomBetween(-2 * radius, 1000 + 2 * radius);
      }
      for(let i = 0; i < currLength; i++) {
        let asteroid = this.asteroids[i];
        if(Math.circleCollisionDetection(x, y, radius + 40, asteroid.x, asteroid.y, asteroid.radius)) {
          collision = true;
        }
      }
      if(!collision) {
        this.ufos.push(new UFO(x, y));
      }
    }
  }

  createPowerUp() {
    let x = Math.randomInt(this.screenSide * 0.10, this.screenSide * 0.90)
    let y = Math.randomInt(this.screenSide * 0.10, this.screenSide * 0.90)
    let random = Math.random();
    if(random > 0.66) {
      this.powerups.push(new PowerUp(x, y, 1));
    }
    else if (random > 0.33) {
      this.powerups.push(new PowerUp(x, y, 2));
    }
    else {
      this.powerups.push(new PowerUp(x, y, 3));
    }
  }

  /** @function rotate()
    * Function to change the velocities to make the collisions act like 1-dimensional collisions
    * @param velocity is the x and y velocities of the asteroid
    * @param float angle is the offset needed to adjust for
    * @returns vector of rotated velocities
    */
  rotate(velocity, angle) {
    const rotatedVelocities = {
        x: velocity.x * Math.cos(angle) - velocity.y * Math.sin(angle),
        y: velocity.x * Math.sin(angle) + velocity.y * Math.cos(angle)
    };
    return rotatedVelocities;
  }

  /** @function particleCollision()
    * Function to handle asteroid to asteroid collisions (treated like elastic particle collisions), I ripped this out of one my side projects
    * @param asteroid is the first asteroid in question
    * @param asteroid otherAsteroid is the other particle in question
    */
  particleCollision(asteroid, otherAsteroid) {
    //Vars to determine the differences in velocities
    let xVelocityDiff = asteroid.velocity.x - otherAsteroid.velocity.x;
    let yVelocityDiff = asteroid.velocity.y - otherAsteroid.velocity.y;
    //Vars to determine the distances between particles
    let xDist = otherAsteroid.x - asteroid.x;
    let yDist = otherAsteroid.y - asteroid.y;

    // Prevent accidental overlap of particles
    if (xVelocityDiff * xDist + yVelocityDiff * yDist >= 0) {

        // Grab angle between the two colliding asteroids
        let angle = -Math.atan2(otherAsteroid.y - asteroid.y, otherAsteroid.x - asteroid.x);

        // Store mass in var for better readability in collision equation
        let m1 = 0;
        let m2 = 0;
        //If UFOs are holding the asteroid, treat them as if they were more massive
        if(asteroid.held === true) {
          m1 = asteroid.mass * 5;
        }
        else {
          m1 = asteroid.mass;
        }
        if(otherAsteroid.held === true) {
          m2 = otherAsteroid.mass * 3;
        }
        else {
          m2 = otherAsteroid.mass;
        }

        // Velocity before equation
        let u1 = this.rotate(asteroid.velocity, angle);
        let u2 = this.rotate(otherAsteroid.velocity, angle);

        // Velocity after 1d collision equation
        let v1 = { x: (u1.x * (m1 - m2) + 2 * m2 * u2.x) / (m1 + m2), y: u1.y };
        let v2 = { x: (u2.x * (m2 - m1) + 2 * m1 * u1.x)/ (m1 + m2), y: u2.y };

        // Final velocity after rotating axis back to original location
        let vFinal1 = this.rotate(v1, -angle);
        let vFinal2 = this.rotate(v2, -angle);

        // Swap particle velocities for realistic bounce effect
        asteroid.velocity.x = vFinal1.x;
        asteroid.velocity.y = vFinal1.y;
        otherAsteroid.velocity.x = vFinal2.x;
        otherAsteroid.velocity.y = vFinal2.y;
    }
  }

  projectileDodger(ufo, projectile) {
    let distance = Math.getDistance(ufo.x, ufo.y, projectile.x, projectile.y);
    if(distance < (ufo.bufferRadius * 2 + projectile.radius)) {
      let direction = Math.getDir(distance, projectile.x, projectile.y, ufo.x, ufo.y);
      ufo.alterPath(direction);
      ufo.setClock();
      ufo.clock--;
    }
    if(distance < (ufo.radius + projectile.radius)) {
      return true;
    }
    return false;
  }

  updateScore(amount) {
    this.score += amount;
    this.hudObjects.score.info = this.score;
  }

  /** @function handleAsteriodExplosion()
    * function to handles asteroids exploding from a projectile
    * @param int aID - index of the asteroid to be exploded
    */
  handleAsteriodExplosion(aID) {
    //Save the essentials
    let asteroid = this.asteroids[aID];
    let mass = asteroid.mass;
    let x = asteroid.x;
    let y = asteroid.y;
    //Get rid of the asteroid
    asteroid.destroyed = true;
    asteroid.held = false;
    //delete this.asteroids[aID];
    this.asteroids.splice(aID, 1);
    this.audioController.trigger('explosion');
    //Smaller asteroids are harder to hit, thus more score
    let points = Math.floor(100 / mass);
    this.popups.push(new PopUp(x, y, points, 'blip'));
    this.updateScore(points);
    //If it isn't too small
    if(mass >= 15) {
      //random number of pieces the asteroid will break into
      let random = Math.randomInt(2, 4);
      //Update asteroid count
      this.numAsteroids += random - 1;
      mass /= random;
      //Random direction
      let direction = Math.randomBetween(0, Math.tau);
      //Uniform distribution
      let angleChange = Math.tau / random;
      for(let i = 0; i < random; i++) {
        //Since mass is also the radius
        let newX = x + Math.cos(direction) * mass;
        let newY = y - Math.sin(direction) * mass;
        //Create new asteroid
        this.asteroids.push(new Asteroid(newX, newY, mass, direction));
        direction += angleChange;
      }
    }
    else {
      this.numAsteroids--;
    }
  }

  /** @function detectShipCrash()
    * determines if a ufo hits an asteroid and determines AI
    * @param Ship ship - must be a ufo
    * @param Asteroid asteroid - asteroid object
    */
  detectShipCrash(ship, asteroid) {
    let dx = ship.x - asteroid.x;
    let dy = ship.y - asteroid.y;
    let distance = dx * dx + dy * dy;
    if(distance < Math.pow(asteroid.radius + ship.radius, 2)) {
      return true;
    }
    if(ship.asteroid === asteroid) {
      return;
    }
    if(distance < Math.pow(ship.bufferRadius + asteroid.radius, 2)) {
      let direction = Math.getDir(distance, asteroid.x, asteroid.y, ship.x, ship.y);
      ship.alterPath(direction);
      if((ship.type === 'Hurler' || ship.type === 'Elite') && asteroid.radius < ship.critical && ship.asteroid === '') {
        ship.catchAsteroid(asteroid);
      }
      //Check if UFO is on the verge of crashing
      else if (distance < Math.pow(ship.critical + asteroid.radius, 2)) {
        //Deploy Counter Measures!!
        if(!ship.reloading) {
          this.ufoProjectile(ship, asteroid.x, asteroid.y);
        }
      }
    }
    return false;
  }

  /** @function explode()
    * function to create explosion particle effects
    * @param floats x, y - position of explosion
    * @param string color - determines the color of particles to be created
    */
  explode(x, y, color) {
    let numParticles = Math.randomInt(30, 70);
    let dir = Math.randomBetween(0, Math.tau);
    let index = 0;
    for(let j = 0; j < this.particles.length; j++) {
      if(this.particles[j].color === color) {
        index = j;
        break;
      }
    }
    for(let i = 0; i < numParticles; i ++) {
      if(Math.random() > 0.6) {
        dir = Math.randomBetween(0, Math.tau);
      }
      this.particles[index].add(x, y, Math.PI + dir, -0.05, 3.5)
    }
  }

  /** @function teleport()
    * function to handle the teleport extra credit
    * Checks if the area is clear before chosing a spot
    */
  teleport() {
    //Random position
    let x = Math.randomBetween(100, 900);
    let y = Math.randomBetween(100, 900);
    //So you don't spawn right next to something and immediately die
    let buffer = 50;
    let collision = false;
    let len = 0;;
    //Loop until you find something, potentially opens the door for infinite loop, but extremely unlikely with the small buffer, and everything is constantly moving
    do {
      if(collision) {
        x = Math.randomBetween(100, 900);
        y = Math.randomBetween(100, 900);
        collision = false;
      }
      //Checks if the ufo is nearby
      len = this.ufos.length;
      for(let i = 0; i < len; i++) {
        let ufo = this.ufos[i];
        if(Math.circleCollisionDetection(x, y, this.ship.radius, ufo.x, ufo.y, ufo.radius + 2 * buffer)) {
          collision = true;
        }
      }
      len = this.asteroids.length;
      for(let i = 0; i < len; i++) {
        let asteroid = this.asteroids[i];
        //Check if new space is free of asteroids
        if(Math.circleCollisionDetection(x, y, this.ship.radius, asteroid.x, asteroid.y, asteroid.radius + buffer)) {
          collision = true;
        }
      }
      len = this.projectiles.length;
      for(let i = 0; i < len; i++) {
        let projectile = this.projectiles[i];
        //Check if the new space if free of projectiles
        if(Math.circleCollisionDetection(projectile.x, projectile.y, projectile.radius, x, y, this.ship.radius + buffer)) {
          collision = true;
        }
      }
    } while(collision);
    //Particle explosion in the to & from spots
    this.explode(this.ship.x, this.ship.y, this.ship.color);
    this.explode(x, y, this.ship.color);
    this.audioController.trigger('teleport');
    this.ship.x = x;
    this.ship.y = y;
    //Resets you ships momentum, Reseting the momentum is definitely easier for the player
    this.ship.speed.x = 0.0;
    this.ship.speed.y = 0.0;
  }

  /** @function respawn()
    * function to handle the player's ship getting destroyed
    */
  respawn() {
    this.respawning = true;
    this.popups.push(new PopUp(400, 500, "RESPAWNING", 'annoucement'));
    this.lives--;
    this.hudObjects.lives.info = this.lives;
    if(this.lives >= 0) {
      this.ship = new Ship();
    }
    else {
      this.gameOver = true;
      this.menu.gameState = 'gameOver';
      this.menu.buttonNames[1] = 'restart';
      this.menu.buttonNames[2] = 'mute';
      this.audioController.trigger('game over');
      this.audioController.stopTheme();
      this.audioController.playMenu();
    }
  }

  /** @function destoryUFO()
    * handles the ufo getting destroyed;
    */
  destoryUFO(ufoID) {
    let ufo = this.ufos[ufoID];
    this.updateScore(ufo.bounty);
    this.popups.push(new PopUp(ufo.x, ufo.y, ufo.bounty, 'blip'));
    if(ufo.asteroid !== '') {
      ufo.asteroid.held = false;
    }
    if(ufo.bounty === 500) {
      this.lives++;
      this.hudObjects.lives.info = this.lives;
      this.createBlip("1 life");
    }
    this.kills++;
    this.ufos.splice(ufoID, 1);
    this.audioController.trigger('ship explosion');
  }

  checkHighScore() {
    if(this.score > this.highscore) {
      this.highscore = this.score;
    }
  }

  createPowerUpBlip(type) {
    let string = '';
    switch (type) {
      case 1:
        string = "Homing Lasers";
        break;
      case 2:
        string = "Rapid Fire";
        break;
      case 3:
        string = "Force Field";
        break;
      default:

    }
    this.createBlip(string);
  }

  createBlip(string) {
    let random = Math.randomInt(20, 50);
    if(this.ship.y > 500) {
      this.popups.push(new PopUp(this.ship.x, this.ship.y - random, string, "blip"));
    }
    else {
      this.popups.push(new PopUp(this.ship.x, this.ship.y + random, string, "blip"));
    }
  }

  /** @function drawHUD()
    * function to draw the HUD at the bottom of the screen
    */
  drawHUD() {
    this.HUDcontext.fillStyle = 'black';
    this.HUDcontext.strokeStyle = 'blue';
    this.HUDcontext.fillRect(0, 0, this.screenSide, 100);
    this.HUDcontext.font = '30px Times New Roman';
    this.HUDcontext.strokeText("LIVES: " + this.lives, 10, 50);
    this.HUDcontext.strokeText("LEVEL: " + this.level, 400, 50);
    this.HUDcontext.strokeText("SCORE: " + this.score, 800, 50);
    this.HUDcontext.strokeText("TELEPORTS: " + this.teleports, 550, 50);
    this.HUDcontext.strokeText("HIGHSCORE: " + this.highscore , 150, 50);
    this.HUDcontext.font = '20px Times New Roman';
    this.HUDcontext.strokeText("CONTROLS: ", 10, 75);
    this.HUDcontext.strokeText("W: Thurster  A: Rotate Left  D: Rotate Right  Space: Shoot  F: Teleport  P: Pause  ~: Reset", 150, 75);
  }

  /** @function update()
    * Handles updating all object and variables, comments laced throughout
    */
  update() {
    //Update PopUps
    for(let i = 0; i < this.popups.length; i++) {
      if(this.popups[i].update()) {
        //delete this.popups[i];
        this.popups.splice(i, 1);
      }
    }
    //Update Ship
    this.ship.update();
    let len = this.ufos.length;
    for(let i = 0; i < len; i++) {
      let ufo = this.ufos[i];
      if((ufo.type === 'Theif' || ufo.type === 'Elite') && ufo.goal === '') {
        if(this.powerups.length > 0) {
          let random = Math.randomInt(0, this.powerups.length - 1)
          ufo.goal = {x: this.powerups[random].pos.x, y: this.powerups[random].pos.y}
        }
      }
      ufo.update();
      if(ufo.asteroid !== '' && !this.respawning) {
        ufo.checkAsteroidAlignment(this.ship);
      }
    }

    if(this.asteroids.length < this.constAsteroids) {
      this.addAsteroid(-1.0);
      this.numAsteroids++;
    }

    //Update each asteroid
    len = this.asteroids.length;
    for(let i = 0; i < len; i++) {
      this.asteroids[i].update();
    }

    //Update Level if no more asteroids
    if(this.kills !== 0 && this.kills % (Math.ceil(this.level * this.level / 2) + 1) === 0) {
      this.level++;
      this.hudObjects.level.info = this.level;
      this.popups.push(new PopUp(450, 500, "Level " + this.level, 'annoucement'));
      //You Will Probably Need These
      this.lives++;
      this.hudObjects.lives.info = this.lives;
      this.createBlip("1 Life");
      this.teleports += this.level;
      let initAsteroids = 3 + this.level;
      if(initAsteroids > this.MAXASTEROIDS) {
        initAsteroids = this.MAXASTEROIDS;
      }
      let difference = initAsteroids - this.asteroids.length;
      if(this.asteroids.length < initAsteroids) {
        for(let i = 0; i < difference; i++) {
          this.addAsteroid(-1.0);
          this.numAsteroids++;
        }
      }
      this.constAsteroids = 3 + this.level;
      if(this.constAsteroids > this.MAXASTEROIDS) {
        this.constAsteroids = this.MAXASTEROIDS;
      }
    }

    //Determine UFO spawning
    if(this.ufoTimer > 0 && this.ufos.length < this.MAXUFO) {
      this.ufoTimer--;
      if(this.ufoTimer <= 0) {
        this.addUFO();
        let scaling = (this.ufos.length / this.level);
        this.ufoTimer = Math.randomInt(this.UFOTIME * scaling, this.UFOTIME * 2 * scaling);
      }
    }

    this.powerupTimer--;
    if(this.powerupTimer <= 0) {
      this.createPowerUp();
      let ratio = (this.powerups.length * 2 / this.level)
      this.powerupTimer = Math.randomInt(this.POWERTIME * ratio, this.POWERTIME * 2 * ratio)
    }

    //Control respawning
    if(this.respawning) {
      this.respawnTimer--;
      if(this.respawnTimer <= 0) {
        //Done respawning, ship can now be destroyed again
        this.respawnTimer = 300;
        this.respawning = false;
      }
    }

    //Checks for collisions between asteroids
    len = this.asteroids.length;
    for(let i = 0; i < len; i++) {
      for(let j = i + 1; j < len; j++) {
        let asteroid = this.asteroids[i];
        let otherAsteroid = this.asteroids[j];
        if(Math.circleCollisionDetection(asteroid.x, asteroid.y, asteroid.radius, otherAsteroid.x, otherAsteroid.y, otherAsteroid.radius)) {
          this.particleCollision(asteroid, otherAsteroid);
          this.audioController.trigger('collision');
        }
      }
    }

    //Checks for collisions between projectiles and asteroids
    for(let i = 0; i < this.projectiles.length; i++) {
      for(let j = 0; j < this.asteroids.length; j++) {
        let projectile = this.projectiles[i];
        let asteroid = this.asteroids[j];
        if(Math.circleCollisionDetection(projectile.x, projectile.y, projectile.radius, asteroid.x, asteroid.y, asteroid.radius)) {
          this.explode(projectile.x, projectile.y, projectile.color);
          this.projectiles.splice(i, 1);
          this.explode(asteroid.x, asteroid.y, 'white');
          this.handleAsteriodExplosion(j);
          break;
        }
      }
    }

    if(!this.respawning) {
      //Check for player crashing
      len = this.asteroids.length;
      for(let i = 0; i < len; i++) {
        let asteroid = this.asteroids[i];
        if(Math.circleCollisionDetection(this.ship.x, this.ship.y, this.ship.radius, asteroid.x, asteroid.y, asteroid.radius)) {
          if(this.ship.powerups[3] && asteroid.mass < 15) {
            this.explode(asteroid.x, asteroid.y, 'white');
            this.handleAsteriodExplosion(i);
            break;
          }
          else {
            this.explode(this.ship.x, this.ship.y, this.ship.color);
            this.audioController.trigger('ship explosion');
            this.respawn();
          }
        }
      }
    }

    //Check if a ship or UFO picks up a powerup
    len = this.ufos.length;
    for(let i = 0; i < this.powerups.length; i++) {
      let powerUp = this.powerups[i];
      if(Math.circleCollisionDetection(this.ship.x, this.ship.y, this.ship.radius, powerUp.pos.x, powerUp.pos.y, powerUp.radius)) {
        this.explode(this.ship.x, this.ship.y, this.ship.color);
        this.ship.powerups[powerUp.type] = true;
        if(this.ship.powerupTimers[powerUp.type] > 0) {
          this.ship.updatePowerUpDisplay(powerUp.type, powerUp.timer);
        }
        else {
          this.ship.createPowerUpDisplay(powerUp.type, powerUp.timer);
        }
        this.ship.powerupTimers[powerUp.type] += powerUp.timer;
        this.createPowerUpBlip(powerUp.type);
        if(powerUp.type === 2) {
          this.ship.reloading = false;
          this.ship.rateOfFire = this.ship.RATE / 2
        }
        this.audioController.trigger('homing pickup');
        this.powerups.splice(i, 1);
        break;
      }
      for(let j = 0; j < len; j++) {
        let ufo = this.ufos[j];
        if(Math.circleCollisionDetection(ufo.x, ufo.y, ufo.radius, powerUp.pos.x, powerUp.pos.y, powerUp.radius)) {
          this.explode(ufo.x, ufo.y, ufo.color);
          ufo.powerups[powerUp.type] = true;
          ufo.powerupTimers[powerUp.type] += powerUp.timer;
          if(powerUp.type === 2) {
            ufo.reloading = false;
            ufo.setRateOfFire();
          }
          this.audioController.trigger('homing pickup');
          this.powerups.splice(i, 1);
          break;
        }
      }
    }

    len = this.asteroids.length;
    for(let i = 0; i < this.powerups.length; i++) {
      for(let k = 0; k < len; k++) {
        let powerUp = this.powerups[i];
        let asteroid = this.asteroids[k];
        if(Math.circleCollisionDetection(asteroid.x, asteroid.y, asteroid.radius, powerUp.pos.x, powerUp.pos.y, powerUp.radius)) {
          this.explode(powerUp.pos.x, powerUp.pos.y, powerUp.color);
          this.powerups.splice(i, 1);
          break;
        }
      }
    }

    for(let i = 0; i < this.ufos.length; i++) {
      for(let j = 0; j < this.asteroids.length; j++) {
        let ufo = this.ufos[i];
        let asteroid = this.asteroids[j];
        if(this.detectShipCrash(ufo, asteroid)) {
          if(ufo.powerups[3] && asteroid.mass < 15) {
            this.explode(asteroid.x, asteroid.y, 'white');
            this.handleAsteriodExplosion(j);
          }
          else {
            this.explode(ufo.x, ufo.y, ufo.color);
            this.destoryUFO(i);
          }
          break;
        }
      }
    }

    len = this.ufos.length;
    if(len > 0) {
      for(let i = 0; i < len; i++) {
        let ufo1 = this.ufos[i];
        if(len > 1) {
          for(let j = i + 1; j < len; j++) {
            let ufo2 = this.ufos[j];
            if(Math.circleCollisionDetection(ufo1.x, ufo1.y, ufo1.critical, ufo2.x, ufo2.y, ufo2.critical)) {
              if((ufo1.type === 'Dodger' || ufo1.type === 'Elite') && !ufo1.reloading) {
                this.ufoProjectile(ufo1, ufo2.x, ufo2.y);
              }
              if((ufo2.type === 'Dodger' || ufo2.type === 'Elite') && !ufo2.reloading) {
                this.ufoProjectile(ufo2, ufo1.x, ufo1.y);
              }
              //Get the direction from the first ufo to the second.
              let dir = Math.getDirection(ufo1.x, ufo1.y, ufo2.x, ufo2.y)
              //Point the direction the other way
              ufo1.alterPath(dir + Math.PI);
              //From the second ufo's perspective, this is pointing away from ufo 1
              ufo2.alterPath(dir);
            }
          }
        }
        if(!this.respawning) {
          if(Math.circleCollisionDetection(this.ship.x, this.ship.y, this.ship.radius, ufo1.x, ufo1.y, ufo1.radius)) {
            this.explode(this.ship.x, this.ship.y, this.ship.color);
            this.audioController.trigger('ship explosion');
            this.respawn();
          }
        }
      }
    }

    //projectile ship collision checks
    for(let i = 0; i < this.projectiles.length; i++) {
      let projectile = this.projectiles[i];
      if(!this.respawning && Math.circleCollisionDetection(projectile.x, projectile.y, projectile.radius,
        this.ship.x, this.ship.y, this.ship.radius)) {
        if(this.ship.powerups[3]) {
          this.explode(this.ship.x, this.ship.y, 'fuchsia');
          this.audioController.trigger('shield broken');
          this.ship.powerupTimers[3] = 0;
        }
        else {
          this.explode(this.ship.x, this.ship.y, this.ship.color);
          this.audioController.trigger('ship explosion');
          this.respawn();
        }
        this.explode(projectile.x, projectile.y, projectile.color);
        this.projectiles.splice(i, 1);
        break;
      }
      for(let j = 0; j < this.ufos.length; j ++) {
        let ufo = this.ufos[j];
        if((ufo.type === 'Dodger' || ufo.type === 'Elite') && ufo.clock === ufo.CLOCK) {
          if(this.projectileDodger(ufo, projectile)) {
            if(ufo.powerups[3]) {
              this.explode(ufo.x, ufo.y, 'fuchsia');
              this.audioController.trigger('shield broken');
              ufo.powerups[3] = false;
              ufo.powerupTimers[3] = 0;
            }
            else {
              this.explode(ufo.x, ufo.y, ufo.color);
              this.destoryUFO(j);
              this.audioController.trigger('ship explosion');
            }
            this.explode(projectile.x, projectile.y, projectile.color);
            this.projectiles.splice(i, 1);
            break;
          }
        }
        else if (Math.circleCollisionDetection(projectile.x, projectile.y, projectile.radius,
          ufo.x, ufo.y, ufo.radius)) {
            if(ufo.powerups[3]) {
              this.explode(ufo.x, ufo.y, 'fuchsia');
              this.audioController.trigger('shield broken');
              ufo.powerups[3] = false;
              ufo.powerupTimers[3] = 0;
            }
            else {
              this.explode(ufo.x, ufo.y, ufo.color);
              this.destoryUFO(j);
              this.audioController.trigger('ship explosion');
            }
            this.explode(projectile.x, projectile.y, projectile.color);
            this.projectiles.splice(i, 1);
            break;
        }
      }
    }

    //Input Map Applying
    //A or Left Arrow
    if(this.keyMap[65] || this.keyMap[37]){
      this.ship.accel.dir -= 0.07;
      if(this.ship.accel.dir <= -Math.tau) {
        this.ship.accel.dir += Math.tau;
      }
    }
    //D or Right Arrow
    if(this.keyMap[68] || this.keyMap[39]) {
      this.ship.accel.dir += 0.07;
      if(this.ship.accel.dir >= Math.tau) {
        this.ship.accel.dir -= Math.tau;
      }
    }
    if((this.respawnTimer <= 150 || !this.respawning)) {
      this.ship.boosting = false;
      //Enter
      if(this.keyMap[13] && this.ship.boost >= 0) {
        this.ship.boosting = true;
        this.ship.boost--;
        this.ship.boostGauge.boost = this.ship.boost;
        this.ship.updateSpeed(this.ship.accel.mag * 3);
        let numParticles = Math.floor(Math.randomBetween(3, 6));
        this.ship.createParticles(numParticles);
      }
      //W or Up Arrow
      else if ((this.keyMap[87] || this.keyMap[38])) {
        this.ship.updateSpeed(this.ship.accel.mag);
        let numParticles = Math.floor(Math.randomBetween(1, 3));
        this.ship.createParticles(numParticles);
      }
    }
    //Space
    if(this.keyMap[32] && !this.ship.reloading && !this.respawning) {
      this.createProjectile();
    }
    //F
    if(this.keyMap[70] && this.teleports > 0 && !this.respawning && this.coolingDown === 50) {
      this.teleport();
      this.teleports--;
      this.coolingDown--;
    }
    //UFOs firing
    if(!this.respawning) {
      len = this.ufos.length;
      for(let i = 0; i < len; i++) {
        let ufo = this.ufos[i];
        ufo.rateOfFire--;
        if(ufo.rateOfFire <= 0) {
          this.ufoProjectile(ufo, this.ship.x, this.ship.y);
          ufo.setRateOfFire();
        }
      }
    }

    //Control Teleport/Prevent multiple from a single button Press
    if(this.coolingDown < 50) {
      this.coolingDown--;
      if(this.coolingDown <= 0) {
        this.coolingDown = 50;
      }
    }

    //Update projectiles, if there are any
    for(let i = 0; i < this.projectiles.length; i++) {
      let projectile = this.projectiles[i];
      if(projectile.color === 'green') {
        projectile.update(this.ufos);
      }
      else {
        projectile.update(this.ship);
      }
      if(projectile.edgeDetection()) {
        this.projectiles.splice(i, 1);
      }
    }

    //update particles
    for(let j = 0; j < this.particles.length; j++) {
      this.particles[j].update();
    }

    //Update highscore
    this.checkHighScore();
  }

  /** @function render()
    * standard render function, calls all other render funcitons and drawHUD
    */
  render() {
    //Initial Setup
    this.backBufferContext.fillStyle = 'black';
    this.backBufferContext.strokeStyle = 'blue';
    this.backBufferContext.font = '50px Times New Roman';
    //Refresh canvas
    this.backBufferContext.fillRect(0,0, this.screenSide, this.screenSide);

    let len = this.ufos.length;
    //Draw UFOs
    for(let i = 0; i < len; i++) {
      this.ufos[i].render(this.backBufferContext);
    }
    //Draw ship
    if(!this.respawning || this.respawnTimer <= 150) {
      this.ship.render(this.backBufferContext);
    }
    len = this.asteroids.length;
    //Draw asteroids
    for(let i = 0; i < len; i++) {
      this.asteroids[i].render(this.backBufferContext);
    }
    len = this.projectiles.length;
    //draw projectiles
    for(let i = 0; i < len; i++) {
      this.projectiles[i].render(this.backBufferContext);
    }

    len = this.powerups.length;
    for(let i = 0; i < len; i++) {
      this.powerups[i].render(this.backBufferContext);
    }

    len = this.particles.length;
    for(let i = 0; i < len; i++) {
      this.particles[i].render(this.backBufferContext);
    }

    len = this.popups.length;
    for(let i = 0; i < len; i++) {
      this.popups[i].render(this.backBufferContext);
    }

    this.hudObjects.score.render(this.backBufferContext);
    this.hudObjects.lives.render(this.backBufferContext);
    this.hudObjects.level.render(this.backBufferContext);

    //Bit blit the back buffer onto the screen
    this.screenBufferContext.drawImage(this.backBufferCanvas, 0, 0);
  }

  /** @function loop()
    * continuously loops the update and render function unless gameOver or paused
    */
  loop() {
    if(!this.paused && !this.gameOver) {
      this.update();
      this.render();
    }
    if(this.gameOver) {
      this.menu.drawGameOver();
    }
    /*
    if(this.gameOver) {
      this.backBufferContext.font = "50px Arial";
      this.backBufferContext.fillStyle = 'yellow';
      this.backBufferContext.fillText("GAME OVER", 350, 500);
      this.backBufferContext.fillText("Retry? Press ~", 360, 600);
      this.screenBufferContext.drawImage(this.backBufferCanvas, 0, 0);
    }
    if(this.paused) {
      this.backBufferContext.font = "50px Arial";
      this.backBufferContext.fillStyle = 'yellow';
      this.backBufferContext.fillText("Paused", 425, 600);
      this.screenBufferContext.drawImage(this.backBufferCanvas, 0, 0);
    }*/
  }
}
