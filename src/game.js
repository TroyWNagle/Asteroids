
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
    * Game object constructor
    * @param {Menu} menu - menu object itself
    */
  constructor(menu) {
    //Size of the screen.
    this.screenSide = menu.screenWidth;
    //Allows the game to interact better with the menu.
    this.menu = menu;
    //Constants
    this.MAXUFO = 5;
    this.MAXASTEROIDS = 6;
    this.UFOTIME = 500;
    this.POWERTIME = 900;
    //Initial asteroids
    this.numAsteroids = 3;
    //Player
    this.ship = new Ship();
    //Array of UFO objects
    this.ufos = [];
    //Number of UFOs destroyed to progress the levels
    this.kills = 0;
    //Variables to control ufo spawn
    this.ufoTimer = Math.randomInt(this.UFOTIME, this.UFOTIME * 2);
    //Vars to help with respawning the player
    this.respawning = false;
    this.respawnTimer = 300;
    //Array of projectile objects
    this.projectiles = [];
    //Array of asteroid objects
    this.asteroids = [];
    this.createAsteroids();
    //Array of particle object pools
    this.particles = [];
    this.initParticlePools();
    //HUD Variables
    this.score = 0;
    this.lives = 3;
    this.level = 1;
    //Array of popup objects that help with giving information to the player.
    this.popups = [];
    //Objects to display variables
    this.hudObjects = {score: '', lives: '', level: ''};
    this.initHUD();
    //Make sure there are never fewer than the inital amount of asteroids
    this.constAsteroids = this.level * this.numAsteroids;
    //controls the teleport function
    this.teleports = 10;
    this.coolingDown = 50;
    //Array of power up objects.
    this.powerups = [];
    //Variable to determine the spawning of power ups.
    this.powerupTimer = Math.randomInt(this.POWERTIME, this.POWERTIME * 3);
    //Variables to help with game state managing.
    this.gameOver = false;
    this.paused = false;

    this.audioController = menu.audioController;

    //Input Map
    this.keyMap = {13: false, 32: false, 37: false, 38: false, 39: false, 65: false, 68: false, 70: false, 87: false, 88: false};

    this.backBufferContext = menu.backBufferContext;
    this.backBufferCanvas = menu.backBufferCanvas;
    this.screenBufferContext = menu.screenBufferContext;

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
    * This function handles the reset of all the major variables.
    */
  masterReset() {
    this.ship = new Ship();
    this.ufos = [];
    this.ufoTimer = Math.randomInt(this.UFOTIME, this.UFOTIME * 2);
    this.powerups = [];
    this.powerupTimer = Math.randomInt(this.POWERTIME, this.POWERTIME * 3);
    this.respawning = false;
    this.respawnTimer = 300;
    this.projectiles = [];
    this.asteroids = [];
    this.numAsteroids = 3;
    this.createAsteroids();
    this.particles = [];
    this.initParticlePools();
    this.score = 0;
    this.lives = 3;
    this.level = 1;
    this.constAsteroids = this.level * this.numAsteroids;
    this.teleports = 10;
    this.coolingDown = 50;
    this.popups = [];
    this.hudObjects = {score: '', lives: '', level: ''};
    this.initHUD();
    this.gameOver = false;
    this.paused = false;
  }

  /** @Function initParticlePools()
    * establishes all the particle object pools for the explosion particle effects.
    */
  initParticlePools() {
    let speed = 5.0;
    let max = 140;
    //Need a object pool for each color of particles.
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
    //P or Escape
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
  }

  /** @function
    * function to handle the keys being lifted up
    */
  handleKeyUp(event) {
    event.preventDefault();
    //Update the key map
    this.keyMap[event.keyCode] = false;
  }

  /** @Function initHUD()
    * Function to initalize hudObjects
    */
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
    //Check if the ship has the homing power up
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
    let direction = Math.getDirection(ufo.x, ufo.y, tx, ty);
    //Again, 1.2 is so the ufo doesn't immediately destory itself when it shoots
    let x = ufo.x + Math.sin(direction)* ufo.radius * 1.2;
    let y = ufo.y - Math.cos(direction)* ufo.radius * 1.2;
    //Check if the UFO has the homing power up.
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
    //Loop that generates random values for the asteroid and makes sure the space is not already occupied
    while (currLength === this.asteroids.length) {
      //Var to determine if it would have spawned inside something
      var collision = false;
      //Pick one side screen
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

  /** @Function addUFO()
  * Function to spawn new UFOs
  */
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
      //Make sure the UFO doesn't spawn inside an Asteroid
      for(let i = 0; i < currLength; i++) {
        let asteroid = this.asteroids[i];
        if(Math.circleCollisionDetection(x, y, radius + 40, asteroid.x, asteroid.y, asteroid.radius)) {
          collision = true;
        }
      }
      //If the place is clear, add an asteroid.
      if(!collision) {
        this.ufos.push(new UFO(x, y));
      }
    }
  }

  /** @Function createPowerUp()
  * Function to create new power ups.
  */
  createPowerUp() {
    //Random Posistion
    let x = Math.randomInt(this.screenSide * 0.10, this.screenSide * 0.90)
    let y = Math.randomInt(this.screenSide * 0.10, this.screenSide * 0.90)
    let random = Math.random();
    //Pick a randomd power up type
    if(random > 0.66) {
      //Homing power up
      this.powerups.push(new PowerUp(x, y, 1));
    }
    else if (random > 0.33) {
      //Rapid Shot power up
      this.powerups.push(new PowerUp(x, y, 2));
    }
    else {
      //Shield power
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
    * Note: Held asteroids caused some problems with this. Some asteroids were clipping through eachother.
    * Solution: Held asteroids are treated as more massive to knock other asteroids out of the way.
    */
  particleCollision(asteroid, otherAsteroid) {
    //Vars to determine the differences in velocities
    let xVelocityDiff = asteroid.velocity.x - otherAsteroid.velocity.x;
    let yVelocityDiff = asteroid.velocity.y - otherAsteroid.velocity.y;
    //Vars to determine the distances between asteroids
    let xDist = otherAsteroid.x - asteroid.x;
    let yDist = otherAsteroid.y - asteroid.y;

    // Prevent accidental overlap of asteroids
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
        //Must check both asteroids
        if(otherAsteroid.held === true) {
          m2 = otherAsteroid.mass * 5;
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

        // Swap asteroid velocities for realistic bounce effect
        asteroid.velocity.x = vFinal1.x;
        asteroid.velocity.y = vFinal1.y;
        otherAsteroid.velocity.x = vFinal2.x;
        otherAsteroid.velocity.y = vFinal2.y;
    }
  }

  /** @Function projectileDodger()
  * Function to handle UFO projectile dodging.
  */
  projectileDodger(ufo, projectile) {
    let distance = Math.getDistance(ufo.x, ufo.y, projectile.x, projectile.y);
    //Check if the distance between UFO & projectile is less than 2 * the buffer radius
    if(distance < (ufo.bufferRadius * 2 + projectile.radius)) {
      //Direction from Projectile to UFO
      let direction = Math.getDir(distance, projectile.x, projectile.y, ufo.x, ufo.y);
      //Move directly away from the projectile
      ufo.alterPath(direction);
      //This is to make sure the the UFO can't constanly dodge
      ufo.setClock();
      ufo.clock--;
    }
    if(distance < (ufo.radius + projectile.radius)) {
      //There is a collision
      return true;
    }
    //No Collision?
    return false;
  }

  /** @Function updateScore()
  * Function to handle updating the score.
  */
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
    //Make sure the asteroid is let go.
    asteroid.held = false;
    //Get rid of the asteroid
    this.asteroids.splice(aID, 1);
    this.audioController.trigger('explosion');
    //Smaller asteroids are harder to hit, thus more score
    let points = Math.floor(100 / mass);
    //Score blip
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
        //Since mass is also the radius, use it to get a starting position for new the asteroids
        let newX = x + Math.cos(direction) * mass;
        let newY = y - Math.sin(direction) * mass;
        //Create new asteroid
        this.asteroids.push(new Asteroid(newX, newY, mass, direction));
        direction += angleChange;
      }
    }
    else {
      //If the asteroi is too small to break into pieces, just update the number of asteroids.
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
    if(distance < (asteroid.radius + ship.radius) * (asteroid.radius + ship.radius)) {
      //There was a crash
      return true;
    }
    //Check if the ship is holding the asteroid.
    if(ship.asteroid === asteroid) {
      //Ignore held asteroids.
      return;
    }
    //Check distance against bufferRadius
    if(distance < (ship.bufferRadius + asteroid.radius) * (ship.bufferRadius + asteroid.radius)) {
      //Get direction from asteroid to the UFO
      let direction = Math.getDir(distance, asteroid.x, asteroid.y, ship.x, ship.y);
      //Move away from it.
      ship.alterPath(direction);
      //Check UFO type, Asteroid size, & if UFO already has an asteroid.
      if((ship.type === 'Hurler' || ship.type === 'Elite') && asteroid.radius < ship.critical && ship.asteroid === '') {
        //Catch the asteroid
        ship.catchAsteroid(asteroid);
      }
      //Check if UFO is on the verge of crashing
      else if (distance < Math.pow(ship.critical + asteroid.radius, 2)) {
        //Deploy Counter Measures!!
        if(!ship.reloading) {
          //Shoot the asteroid
          this.ufoProjectile(ship, asteroid.x, asteroid.y);
        }
      }
    }
    //UFO & asteroid are too far apart to do anything.
    return false;
  }

  /** @function explode()
    * function to create explosion particle effects
    * @param {floats} x, y - position of explosion
    * @param {string} color - determines the color of particles to be created
    */
  explode(x, y, color) {
    let numParticles = Math.randomInt(30, 70);
    let dir = Math.randomBetween(0, Math.tau);
    let index = 0;
    //Determine the correct particle object pool by color
    for(let j = 0; j < this.particles.length; j++) {
      if(this.particles[j].color === color) {
        index = j;
        break;
      }
    }
    for(let i = 0; i < numParticles; i ++) {
      //Generate a new direction some times
      if(Math.random() > 0.4) {
        dir = Math.randomBetween(0, Math.tau);
      }
      //Add the new particle to the pool
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
    //New pop up to tell the player they are respawning
    this.popups.push(new PopUp(350, 400, "RESPAWNING", 'annoucement'));
    this.lives--;
    //Update HUD object that handles lives
    this.hudObjects.lives.info = this.lives;
    if(this.lives >= 0) {
      this.ship = new Ship();
    }
    else {
      //Out of lives, it is game over.
      this.gameOver = true;
      //Adjust the gameState
      this.menu.gameState = 'gameOver';
      //Reuse the Button objects & change their names.
      this.menu.buttonNames[1] = 'restart';
      this.menu.buttonNames[2] = 'mute';
      this.audioController.trigger('game over');
      this.audioController.stopTheme();
      this.audioController.playMenu();
    }
  }

  /** @function destoryUFO()
    * Handles the ufo getting destroyed.
    * @param {int} ufoID - index for the UFOs array to select the proper UFO.
    */
  destoryUFO(ufoID) {
    let ufo = this.ufos[ufoID];
    this.updateScore(ufo.bounty);
    //Score Blip
    this.popups.push(new PopUp(ufo.x, ufo.y, ufo.bounty, 'blip'));
    //If it has an asteroid, make sure the asteroid knows it isn't held anymore.
    if(ufo.asteroid !== '') {
      ufo.asteroid.held = false;
    }
    //If it is an Elite UFO you get a life.
    if(ufo.bounty === 500) {
      this.lives++;
      //Update HUD object
      this.hudObjects.lives.info = this.lives;
      this.createBlip("1 life");
    }
    this.kills++;
    //Get rid of the UFO
    this.ufos.splice(ufoID, 1);
    this.audioController.trigger('ship explosion');
  }

  /** @Function createPowerUpBlip()
    * Helper function to determine the type of pop up to display
    * @param {int} type - the type of power up picked up.
    */
  createPowerUpBlip(type) {
    let string = '';
    //Check the type of power up.
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
    //Create a pop up for this power up pick up.
    this.createBlip(string);
  }

  /** @Function
    * Function to create pop ups of type blips, which are just short pop ups.
    * @param {string} string - the message that will be displayed in the pop up.
    */
  createBlip(string) {
    let random = Math.randomInt(20, 50);
    //Determine if the pop up will be above or below the ship based on Y position.
    if(this.ship.y > 500) {
      this.popups.push(new PopUp(this.ship.x, this.ship.y - random, string, "blip"));
    }
    else {
      this.popups.push(new PopUp(this.ship.x, this.ship.y + random, string, "blip"));
    }
  }

  /** @Function projectileHit()
    * Handles whether or not the ship in question should be destroyed or not.
    * @param {Ship} ship - Ship object, could be UFO or Player ship
    * @param {int} projectileID - index for the projectiles array
    */
  projectileHit(ship, projectileID) {
    let projectile = this.projectiles[projectileID];
    let destoryed = false;
    //Check if shield power ups is active.
    if(ship.powerups[3]) {
      this.explode(ship.x, ship.y, 'fuchsia');
      this.audioController.trigger('shield broken');
      ship.powerupTimers[3] = 0;
      //Ship doesn't get destroyed if it has a shield
      destoryed = false;
    }
    else {
      this.explode(ship.x, ship.y, ship.color);
      this.audioController.trigger('ship explosion');
      //Ship does get destoyed if it doesn't have a shield.
      destoryed = true;
    }
    //Delete the projectile regardless & explode it.
    this.explode(projectile.x, projectile.y, projectile.color);
    this.projectiles.splice(projectileID, 1);
    return destoryed;
  }

  /** @Functiono pickUpPowerUp()
    * Handles updating the ship that collided with a power up.
    * @param {Ship} ship - ship object, could be player or UFO
    * @param {PowerUp} powerUP - PowerUp object
    */
  pickUpPowerUp(ship, powerUp) {
    //Set the power up type to true
    ship.powerups[powerUp.type] = true;
    //Update the timer.
    ship.powerupTimers[powerUp.type] += powerUp.timer;
    //If the power up type is rapid fire, immediately update the rate of fire.
    if(powerUp.type === 2) {
      ship.reloading = false;
      ship.setRateOfFire();
    }
  }

  /** @function update()
    * Handles updating all object and variables, comments laced throughout
    * Note: len is used throughout the function in hopes of reducing garbage collection. Also preventing .length properties from being executed multiple times
    * through loops when possible.
    */
  update() {
    //Update PopUps
    for(let i = 0; i < this.popups.length; i++) {
      if(this.popups[i].update()) {
        //Update returns true if the life of the pop ups is 0 or less.
        this.popups.splice(i, 1);
      }
    }
    //Update Ship
    this.ship.update();

    let len = this.ufos.length;
    for(let i = 0; i < len; i++) {
      let ufo = this.ufos[i];
      //Check type of UFO & if it already has a goal destination
      if((ufo.type === 'Theif' || ufo.type === 'Elite') && ufo.goal === '') {
        //Check if there are any power ups.
        if(this.powerups.length > 0) {
          let random = Math.randomInt(0, this.powerups.length - 1)
          //Assign the position of a power up to the UFOs goal destination.
          ufo.goal = {x: this.powerups[random].pos.x, y: this.powerups[random].pos.y}
        }
      }
      ufo.update();

      //Check if UFO has an asteroid & the player is not respawning
      if(ufo.asteroid !== '' && !this.respawning) {
        //Check to see if UFO can throw the asteroid at the player.
        ufo.checkAsteroidAlignment(this.ship);
      }
    }

    //If number of asteroids is getting low, add an asteroid.
    if(this.asteroids.length < this.constAsteroids) {
      this.addAsteroid(-1.0);
      this.numAsteroids++;
    }

    //Update each asteroid
    len = this.asteroids.length;
    for(let i = 0; i < len; i++) {
      this.asteroids[i].update();
    }

    //Level is based off of UFO kills. (Level ^ 2) / 2 + 1 is the current growth rate. Works pretty well after the first 3 levels.
    if(this.kills !== 0 && this.kills % (Math.ceil(this.level * this.level / 2) + 1) === 0) {
      this.level++;
      //Update the HUD Object for level.
      this.hudObjects.level.info = this.level;
      this.popups.push(new PopUp(450, 500, "Level " + this.level, 'annoucement'));
      this.lives++;
      //Update HUD object for lives
      this.hudObjects.lives.info = this.lives;
      this.createBlip("1 Life");
      this.teleports += this.level;
      //Initial asteroids for each level increases
      let initAsteroids = 3 + this.level;
      //Enforce the max of initial asteroids.
      if(initAsteroids > this.MAXASTEROIDS) {
        initAsteroids = this.MAXASTEROIDS;
      }
      let difference = initAsteroids - this.asteroids.length;
      if(this.asteroids.length < initAsteroids) {
        //Create asteroids to make up the difference for the new level.
        for(let i = 0; i < difference; i++) {
          this.addAsteroid(-1.0);
          this.numAsteroids++;
        }
      }
      //Update the variable that makes sure there are always a minimum number of asterods.
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
        //Level scaling. As the level goes up, the faster UFOs spawn.
        let scaling = (this.ufos.length / this.level);
        this.ufoTimer = Math.randomInt(this.UFOTIME * scaling, this.UFOTIME * 2 * scaling);
      }
    }

    this.powerupTimer--;
    if(this.powerupTimer <= 0) {
      this.createPowerUp();
      //Level scaling. Similar to UFO scaling, but slower. Take much longer for power ups to spawn quickly.
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
        //Check if there is a collision.
        if(Math.circleCollisionDetection(asteroid.x, asteroid.y, asteroid.radius, otherAsteroid.x, otherAsteroid.y, otherAsteroid.radius)) {
          //Call function responsible for the math behind the collisions.
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
        //Check if there is a collision.
        if(Math.circleCollisionDetection(projectile.x, projectile.y, projectile.radius, asteroid.x, asteroid.y, asteroid.radius)) {
          //Explode the projectile & get rid of it.
          this.explode(projectile.x, projectile.y, projectile.color);
          this.projectiles.splice(i, 1);
          //Explode the Asteroid & attempt to break it.
          this.explode(asteroid.x, asteroid.y, 'white');
          this.handleAsteriodExplosion(j);
          break;
        }
      }
    }

    //Make sure the player isn't respawning
    if(!this.respawning) {
      //Check for player crashing
      len = this.asteroids.length;
      for(let i = 0; i < len; i++) {
        let asteroid = this.asteroids[i];
        //Check for collision.
        if(Math.circleCollisionDetection(this.ship.x, this.ship.y, this.ship.radius, asteroid.x, asteroid.y, asteroid.radius)) {
          //Check if shield power up is active & the asteroid is small enough.
          if(this.ship.powerups[3] && asteroid.mass < 15) {
            //Shield protects player from asteroid & destorys asteroid.
            this.explode(asteroid.x, asteroid.y, 'white');
            this.handleAsteriodExplosion(i);
            break;
          }
          else {
            //Player is killed by asteroid.
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
      //Check for collision
      if(Math.circleCollisionDetection(this.ship.x, this.ship.y, this.ship.radius, powerUp.pos.x, powerUp.pos.y, powerUp.radius)) {
        this.explode(this.ship.x, this.ship.y, this.ship.color);
        //check if the player already has the power up or not & update the displays correctly.
        if(this.ship.powerupTimers[powerUp.type] > 0) {
          this.ship.updatePowerUpDisplay(powerUp.type, powerUp.timer);
        }
        else {
          this.ship.createPowerUpDisplay(powerUp.type, powerUp.timer);
        }
        this.pickUpPowerUp(this.ship, powerUp);

        //Create power up blip on pick up.
        this.createPowerUpBlip(powerUp.type);
        //Play sound & get rid of the power up.
        this.audioController.trigger('homing pickup');
        this.powerups.splice(i, 1);
        break;
      }
      for(let j = 0; j < len; j++) {
        let ufo = this.ufos[j];
        //Check for collision.
        if(Math.circleCollisionDetection(ufo.x, ufo.y, ufo.radius, powerUp.pos.x, powerUp.pos.y, powerUp.radius)) {
          this.explode(ufo.x, ufo.y, ufo.color);
          this.pickUpPowerUp(ufo, powerUp);
          //Play sound & get rid of power up
          this.audioController.trigger('homing pickup');
          this.powerups.splice(i, 1);
          break;
        }
      }
    }

    len = this.asteroids.length;
    //Check if a asteroid runs over a power up
    for(let i = 0; i < this.powerups.length; i++) {
      for(let k = 0; k < len; k++) {
        let powerUp = this.powerups[i];
        let asteroid = this.asteroids[k];
        //Check for a collision
        if(Math.circleCollisionDetection(asteroid.x, asteroid.y, asteroid.radius, powerUp.pos.x, powerUp.pos.y, powerUp.radius)) {
          //Destroy the power up.
          this.explode(powerUp.pos.x, powerUp.pos.y, powerUp.color);
          this.powerups.splice(i, 1);
          break;
        }
      }
    }

    //Check UFOs against Asteroids
    for(let i = 0; i < this.ufos.length; i++) {
      for(let j = 0; j < this.asteroids.length; j++) {
        let ufo = this.ufos[i];
        let asteroid = this.asteroids[j];
        //Determine ship & asteroid interactions. Returns true if they collide with each other.
        if(this.detectShipCrash(ufo, asteroid)) {
          //If UFO has a shield & the asteroid is small enough, the asteroid is destoryed.
          if(ufo.powerups[3] && asteroid.mass < 15) {
            this.explode(asteroid.x, asteroid.y, 'white');
            this.handleAsteriodExplosion(j);
          }
          else {
            //Else destory the UFO.
            this.explode(ufo.x, ufo.y, ufo.color);
            this.destoryUFO(i);
          }
          break;
        }
      }
    }

    len = this.ufos.length;
    if(len > 0) {
      //Check the UFOs against themselves & the player.
      for(let i = 0; i < len; i++) {
        let ufo1 = this.ufos[i];
        //If there is more than one UFO in play
        if(len > 1) {
          for(let j = i + 1; j < len; j++) {
            let ufo2 = this.ufos[j];
            //Check for critical thresholds
            if(Math.circleCollisionDetection(ufo1.x, ufo1.y, ufo1.critical, ufo2.x, ufo2.y, ufo2.critical)) {
              //Check type & if reloading. Some UFOs will shoot others to save themselves.
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
        //Make sure the Player is not respawning.
        if(!this.respawning) {
          //Check for collision
          if(Math.circleCollisionDetection(this.ship.x, this.ship.y, this.ship.radius, ufo1.x, ufo1.y, ufo1.radius)) {
            //Destroy the player.
            this.explode(this.ship.x, this.ship.y, this.ship.color);
            this.audioController.trigger('ship explosion');
            this.respawn();
          }
        }
      }
    }

    //Projectile & Ship collisions (UFOs & Player)
    for(let i = 0; i < this.projectiles.length; i++) {
      let projectile = this.projectiles[i];
      //Check for collision & if respawning
      if(!this.respawning && Math.circleCollisionDetection(projectile.x, projectile.y, projectile.radius,
        this.ship.x, this.ship.y, this.ship.radius)) {
        //Check if the projectile kills the player or not.
        if(this.projectileHit(this.ship, i)) {
          this.respawn();
        }
        break;
      }

      //Check the UFOs
      for(let j = 0; j < this.ufos.length; j ++) {
        let ufo = this.ufos[j];
        //Check UFO type & that the cooldown of its dodge is off.
        if((ufo.type === 'Dodger' || ufo.type === 'Elite') && ufo.clock === ufo.CLOCK) {
          //Attempt to dodge the projectile
          if(this.projectileDodger(ufo, projectile)) {
            //Check if the projectile kills the UFO
            if(this.projectileHit(ufo, i)) {
              this.destoryUFO(j);
            }
            break;
          }
        }
        else if (Math.circleCollisionDetection(projectile.x, projectile.y, projectile.radius,
          ufo.x, ufo.y, ufo.radius)) {
            if(this.projectileHit(ufo, i)) {
              this.destoryUFO(j);
            }
            break;
        }
      }
    }

    //Input Map Applying
    //A or Left Arrow - Spin left (counter-clockwise)
    if(this.keyMap[65] || this.keyMap[37]) {
      this.ship.accel.dir -= 0.07;
      if(this.ship.accel.dir <= -Math.tau) {
        this.ship.accel.dir += Math.tau;
      }
    }
    //D or Right Arrow - Spin right (clockwise)
    if(this.keyMap[68] || this.keyMap[39]) {
      this.ship.accel.dir += 0.07;
      if(this.ship.accel.dir >= Math.tau) {
        this.ship.accel.dir -= Math.tau;
      }
    }
    if((this.respawnTimer <= 150 || !this.respawning)) {
      this.ship.boosting = false;
      //Enter - constrols the boosting of the player
      if(this.keyMap[13] && this.ship.boost >= 0) {
        this.ship.boosting = true;
        this.ship.boost--;
        this.ship.boostGauge.boost = this.ship.boost;
        this.ship.updateSpeed(this.ship.accel.mag * 3);
        let numParticles = Math.randomInt(3, 6);
        this.ship.createParticles(numParticles);
      }
      //W or Up Arrow - Main thruster
      else if ((this.keyMap[87] || this.keyMap[38])) {
        this.ship.updateSpeed(this.ship.accel.mag);
        let numParticles = Math.randomInt(1, 4);
        this.ship.createParticles(numParticles);
      }
    }
    //Space - Shooting
    if(this.keyMap[32] && !this.ship.reloading && !this.respawning) {
      this.createProjectile();
    }
    //F - Teleporting
    if(this.keyMap[70] && this.teleports > 0 && !this.respawning && this.coolingDown === 50) {
      this.teleport();
      this.teleports--;
      this.coolingDown--;
    }
    //UFOs won't shoot while player is respawning
    if(!this.respawning) {
      len = this.ufos.length;
      for(let i = 0; i < len; i++) {
        let ufo = this.ufos[i];
        ufo.rateOfFire--;
        if(ufo.rateOfFire <= 0) {
          //Shoot at the player
          this.ufoProjectile(ufo, this.ship.x, this.ship.y);
          //Reset Shooting cooldown
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
      //Passes targets to projectiles in case they are homing projectiles.
      if(projectile.color === 'green') {
        //Player projectiles will only seek out UFOs
        projectile.update(this.ufos);
      }
      else {
        //UFO projectiles will only seek out the player.
        projectile.update(this.ship);
      }
      //Delete Off-screen projectiles
      if(projectile.edgeDetection()) {
        this.projectiles.splice(i, 1);
      }
    }

    //update particles
    for(let j = 0; j < this.particles.length; j++) {
      this.particles[j].update();
    }
  }

  /** @function render()
    * standard render function, refreshes the screen, calls all other render functions for objects, &
    * bit blits the back buffer onto the screen.
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
    //Draw projectiles
    for(let i = 0; i < len; i++) {
      this.projectiles[i].render(this.backBufferContext);
    }

    //Draw PowerUps
    len = this.powerups.length;
    for(let i = 0; i < len; i++) {
      this.powerups[i].render(this.backBufferContext);
    }

    //Draw Paricles
    len = this.particles.length;
    for(let i = 0; i < len; i++) {
      this.particles[i].render(this.backBufferContext);
    }

    //Draw PopUps
    len = this.popups.length;
    for(let i = 0; i < len; i++) {
      this.popups[i].render(this.backBufferContext);
    }

    //Draw HUD Objects
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
    //If not Paused or Game Over, continuously update and render
    if(!this.paused && !this.gameOver) {
      this.update();
      this.render();
    }
    if(this.gameOver) {
      //Draw the Game Over in Menu
      this.menu.drawGameOver();
    }
  }
}
