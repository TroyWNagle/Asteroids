
import Ship from './ship.js';
import Asteroid from './asteroid.js';
import Projectile from './projectile.js';
import Homing from './homing.js';
import Particle from './particles.js';
import UFO from './ufo.js';
import PowerUp from './powerup.js';
import './math.js';
import AudioController from './audiocontroller.js';

/** @class Game
  * Game object that controls the interactions between all other Objects
  */
export default class Game {
  /** @constructor
    * Game object constructor, no arguement, sets up all the necessities.
    */
  constructor() {
    this.screenSide = 1000;
    //Num Objects
    this.numAsteroids = 5;
    //Objects/Arrays
    this.ship = new Ship();
    this.ufos = [];
    this.MAXUFO = 5;
    //Variables to control ufo spawn
    this.ufoTimer = Math.randomInt(500, 1000);
    //var To control ufo firing
    //this.ufoRateOfFire = Math.randomInt(150, 350);
    //Vars to help with respawning the player
    this.respawning = false;
    this.respawnTimer = 300;
    this.projectiles = [];
    this.asteroids = [];
    this.createAsteroids();
    this.particles = [];
    //HUD Variables
    this.score = 0;
    this.highscore = 0;
    this.lives = 3;
    this.level = 1;
    //controls the teleport function
    this.teleports = 10;
    this.coolingDown = 50;
    this.powerups = [];
    this.powerupTimer = Math.randomInt(1000, 5000);
    //Over Loop Controllers
    this.gameOver = false;;
    this.paused = false;

    this.audioController = new AudioController();

    //Input Map
    this.keyMap = {13: false, 32: false, 37: false, 38: false, 39: false, 65: false, 68: false, 70: false, 87: false, 88: false};

    //HUD
    this.HUDcanvas = document.getElementById('ui');
    this.HUDcanvas.width = this.screenSide;
    this.HUDcanvas.height = 100;
    this.HUDcontext = this.HUDcanvas.getContext('2d');
    document.body.appendChild(this.HUDcanvas);

    //Back Buffer
    this.backBufferCanvas = document.getElementById("canvas");
    this.backBufferCanvas.width = this.screenSide;
    this.backBufferCanvas.height = this.screenSide;
    this.backBufferContext = this.backBufferCanvas.getContext('2d');

    //Canvas that actually gets put on the screen
    this.screenBufferCanvas = document.getElementById("canvas");
    this.screenBufferCanvas.width = this.screenSide;
    this.screenBufferCanvas.height = this.screenSide;
    document.body.appendChild(this.screenBufferCanvas);
    this.screenBufferContext = this.screenBufferCanvas.getContext('2d');

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
    this.ufoTimer = Math.randomInt(1000, 2000);
    //var To control ufo firing
    //this.ufoRateOfFire = Math.randomInt(150, 350);
    //Vars to help with respawning the player
    this.respawning = false;
    this.respawnTimer = 300;
    this.projectiles = [];
    //Vars to help control player projectiles
    this.rateOfFire = 40;
    this.reloading = false;
    this.asteroids = [];
    this.numAsteroids = 10;
    this.createAsteroids();
    this.particles = [];
    //HUD Variables
    this.score = 0;
    this.lives = 3;
    this.level = 1;
    //controls the telepor function
    this.teleports = 10;
    this.coolingDown = 50;
    //Over Loop Controllers
    this.gameOver = false;
    this.paused = false;
    /*this.theme.loop = true;
    this.theme.play();*/
  }

  /** @function handleKeyDown()
    * function to handle key presses
    */
  handleKeyDown(event) {
    event.preventDefault();
    //Update the keyMap
    this.keyMap[event.keyCode] = true;
    //Handle the Pause seperately, to control the loop function
    if(event.keyCode === 80) {
      if(this.paused) {
        this.paused = false;
      }
      else {
        this.paused = true;
      }
    }
    if(event.keyCode === 192) {
      this.masterReset();
    }
  }

  /** @function
    * function to handle the keys being lifted up
    */
  handleKeyUp(event) {
    event.preventDefault();
    //Update the key map
    this.keyMap[event.keyCode] = false;
  }

  /** @function
    * function to create a Projectile from the player's ship
    */
  createProjectile() {
    //Get the coordinates of the tip of the ship, The 1.2 is so you can't run into your own shot immediately
    var x = this.ship.x + Math.sin(this.ship.velocity.dir)* this.ship.radius * 1.2;
    var y = this.ship.y - Math.cos(this.ship.velocity.dir)* this.ship.radius * 1.2;
    if(this.ship.powerups[1]) {
      this.projectiles.push(new Homing(x, y, this.ship.velocity.dir, this.ship.color));
    }
    else {
      this.projectiles.push(new Projectile(x, y, this.ship.velocity.dir, this.ship.color));
    }
    this.ship.reloading = true;
  }

  /** @function
    * function to handle UFO projectiles
    * @param float tx - is the x position of the target
    * @param float ty - is the y position of the target
    */
  ufoProjectile(ufo, tx, ty) {
    var dx = ufo.x - tx;
    var dy = ufo.y - ty;
    //Draw a line to the target
    var distance = Math.sqrt(dx * dx + dy * dy);
    //Get the direction to the target
    var direction = Math.acos(dy / distance);
    //Mirror the angle for the left hand side
    if(dx > 0) {
      direction *= -1;
    }
    //Again, 1.2 is so the ufo doesn't immediately destory itself when it shoots
    var x = ufo.x + Math.sin(direction)* ufo.radius * 1.2;
    var y = ufo.y - Math.cos(direction)* ufo.radius * 1.2;
    if(ufo.powerups[1]) {
      this.projectiles.push(new Homing(x, y, direction, ufo.color));
    }
    else {
      this.projectiles.push(new Projectile(x, y, direction, ufo.color));
    }
    this.audioController.trigger('shoot');
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
    var x;
    var y;
    var radius;
    var mass;
    //Var to control the while loop
    var currLength = this.asteroids.length;
    //Loop that generates random values for the particle and makes sure the space is not already occupied
    while (currLength === this.asteroids.length) {
      //Var to determine if it would have spawned inside something
      var collision = false;
      var spawnSide = Math.randomInt(1, 5);
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
      this.asteroids.forEach(asteroid => {
        if(Math.circleCollisionDetection(asteroid.x, asteroid.y, asteroid.radius, x, y, radius)) {
          collision = true;
        }
      });
      if(!collision) {
        this.asteroids.push(new Asteroid(x, y, mass, direction));
      }
    }
  }

  addUFO() {
    var x;
    var y;
    var radius = 25;
    var currLength = this.ufos.length;

    while(currLength === this.ufos.length) {
      var collision = false;
      var spawnSide = Math.randomInt(1, 5);
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
      this.asteroids.forEach(asteroid => {
        if(Math.circleCollisionDetection(x, y, radius + 40, asteroid.x, asteroid.y, asteroid.radius)) {
          collision = true;
        }
      });
      if(!collision) {
        this.ufos.push(new UFO(x, y));
      }
    }
  }

  createPowerUp() {
    let x = Math.randomInt(this.screenSide * 0.10, this.screenSide * 0.90)
    let y = Math.randomInt(this.screenSide * 0.10, this.screenSide * 0.90)
    let random = Math.random();
    if(random > 0.50) {
      this.powerups.push(new PowerUp(x, y, 1));
    }
    else {
      this.powerups.push(new PowerUp(x, y, 2));
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
    var xVelocityDiff = asteroid.velocity.x - otherAsteroid.velocity.x;
    var yVelocityDiff = asteroid.velocity.y - otherAsteroid.velocity.y;
    //Vars to determine the distances between particles
    var xDist = otherAsteroid.x - asteroid.x;
    var yDist = otherAsteroid.y - asteroid.y;

    // Prevent accidental overlap of particles
    if (xVelocityDiff * xDist + yVelocityDiff * yDist >= 0) {

        // Grab angle between the two colliding asteroids
        var angle = -Math.atan2(otherAsteroid.y - asteroid.y, otherAsteroid.x - asteroid.x);

        // Store mass in var for better readability in collision equation
        var m1 = asteroid.mass;
        var m2 = otherAsteroid.mass;

        // Velocity before equation
        var u1 = this.rotate(asteroid.velocity, angle);
        var u2 = this.rotate(otherAsteroid.velocity, angle);

        // Velocity after 1d collision equation
        var v1 = { x: (u1.x * (m1 - m2) + 2 * m2 * u2.x) / (m1 + m2), y: u1.y };
        var v2 = { x: (u2.x * (m2 - m1) + 2 * m1 * u1.x)/ (m1 + m2), y: u2.y };

        // Final velocity after rotating axis back to original location
        var vFinal1 = this.rotate(v1, -angle);
        var vFinal2 = this.rotate(v2, -angle);

        // Swap particle velocities for realistic bounce effect
        asteroid.velocity.x = vFinal1.x;
        asteroid.velocity.y = vFinal1.y;
        otherAsteroid.velocity.x = vFinal2.x;
        otherAsteroid.velocity.y = vFinal2.y;
    }
  }

  projectileDodger(ufo, projectile) {
    var dx = ufo.x - projectile.x;
    var dy = ufo.y - projectile.y;
    var distance = dx * dx + dy * dy;
    //check if ufo
    if(distance < (ufo.radius + projectile.radius) * (ufo.radius + projectile.radius)) {
      return true;
    }
    if(distance < (ufo.bufferRadius + projectile.radius) * (ufo.bufferRadius + projectile.radius)) {

    }
    return false;
  }

  /** @function handleAsteriodExplosion()
    * function to handles asteroids exploding from a projectile
    * @param int aID - index of the asteroid to be exploded
    */
  handleAsteriodExplosion(aID) {
    //Save the essentials
    var asteroid = this.asteroids[aID];
    var mass = asteroid.mass;
    var x = asteroid.x;
    var y = asteroid.y;
    //Get rid of the asteroid
    asteroid.destroyed = true;
    this.asteroids.splice(aID, 1);
    this.audioController.trigger('explosion');
    //Smaller asteroids are harder to hit, thus more score
    this.score += Math.floor(100 / mass);
    //If it isn't too small
    if(mass >= 15) {
      //random number of pieces the asteroid will break into
      var random = Math.randomInt(2, 4);
      //Update asteroid count
      this.numAsteroids += random - 1;
      mass /= random;
      //Random direction
      var direction = Math.randomBetween(0, 2 * Math.PI);
      //Uniform distribution
      var angleChange = 2 * Math.PI / random;
      for(var i = 0; i < random; i++) {
        //Since mass is also the radius
        var newX = x + Math.cos(direction) * mass;
        var newY = y - Math.sin(direction) * mass;
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
    var dx = ship.x - asteroid.x;
    var dy = ship.y - asteroid.y;
    var distance = dx * dx + dy * dy;
    if(distance < Math.pow(asteroid.radius + ship.radius, 2)) {
      return true;
    }
    if(ship.asteroid === asteroid) {
      return;
    }
    if(distance < Math.pow(ship.bufferRadius + asteroid.radius, 2)) {
      let direction = Math.getDirection(ship.x, ship.y, asteroid.x, asteroid.y);
      ship.alterPath(direction + Math.PI);
      if(ship.color === 'blue' && asteroid.radius < ship.critical && ship.asteroid === '') {
        ship.catchAsteroid(asteroid)
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
    var numParticles = Math.randomInt(30, 70);
    var dir = Math.randomBetween(0, Math.PI * 2);
    for(var i = 0; i < numParticles; i ++) {
      if(Math.randomInt(0, 100) > 90) {
        dir = Math.randomBetween(0, Math.PI * 2);
      }
      this.particles.push(new Particle(x, y, Math.PI * dir, 3, color, 20));
    }
  }

  /** @function teleport()
    * function to handle the teleport extra credit
    * Checks if the area is clear before chosing a spot
    */
  teleport() {
    //Random position
    var x = Math.randomBetween(100, 900);
    var y = Math.randomBetween(100, 900);
    //So you don't spawn right next to something and immediately die
    var buffer = 50;
    var collision = false;
    //Loop until you find something, potentially opens the door for infinite loop, but extremely unlikely with the small buffer, and everything is constantly moving
    do {
      if(collision) {
        x = Math.randomBetween(100, 900);
        y = Math.randomBetween(100, 900);
        collision = false;
      }
      //Checks if the ufo is nearby
      this.ufos.forEach(ufo => {
        if(Math.circleCollisionDetection(x, y, this.ship.radius, ufo.x, ufo.y, ufo.radius + 2 * buffer)) {
          collision = true;
        }
      });
      this.asteroids.forEach(asteroid => {
        //Check if new space is free of asteroids
        if(Math.circleCollisionDetection(x, y, this.ship.radius, asteroid.x, asteroid.y, asteroid.radius + buffer)) {
          collision = true;
        }
      });
      this.projectiles.forEach(projectile => {
        //Check if the new space if free of projectiles
        if(Math.circleCollisionDetection(projectile.x, projectile.y, projectile.radius, x, y, this.ship.radius + buffer)) {
          collision = true;
        }
      });
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
    this.lives--;
    if(this.lives >= 0) {
      this.ship = new Ship();
    }
    else {
      this.gameOver = true;
      /*this.theme.loop = false;
      this.theme.pause();*/
      this.audioController.trigger('game over');
    }
  }

  /** @function destoryUFO()
    * handles the ufo getting destroyed;
    */
  destoryUFO(ufoID) {
    this.score += this.ufos[ufoID].bounty;
    if(this.ufos[ufoID].bounty === 200) {
      this.lives++;
    }
    this.ufos.splice(ufoID, 1);
    this.audioController.trigger('ship explosion');
  }

  checkHighScore() {
    if(this.score > this.highscore) {
      this.highscore = this.score;
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
    //Update Ship
    this.ship.update();
    //Update UFO if applicable
    this.ufos.forEach(ufo => {
      if(ufo.color === 'orange' && ufo.goal === '') {
        if(this.powerups.length > 0) {
          let random = Math.randomInt(0, this.powerups.length - 1)
          ufo.goal = {x: this.powerups[random].pos.x, y: this.powerups[random].pos.y}
        }
      }
      ufo.update();
      if(ufo.asteroid !== '') {
        ufo.checkAsteroidAlignment(this.ship);
      }
    });
    //Update each asteroid
    this.asteroids.forEach(asteroid => {
      asteroid.update();
    });

    //Update Level if no more asteroids
    if(this.asteroids.length === 0) {
      this.level++;
      //You Will Probably Need These
      this.lives += this.level;
      this.teleports += this.level;
      this.numAsteroids = 10 + 2 * this.level;
      this.createAsteroids();
    }

    //Determine UFO spawning
    if(this.ufoTimer > 0 && this.ufos.length < this.MAXUFO) {
      this.ufoTimer--;
      if(this.ufoTimer <= 0) {
        this.addUFO();
        this.ufoTimer = Math.randomInt(1000, 2000);
      }
    }

    this.powerupTimer--;
    if(this.powerupTimer <= 0) {
      this.createPowerUp();
      this.powerupTimer = Math.randomInt(1000, 5000)
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
    for(let i = 0; i < this.asteroids.length; i++) {
      for(let j = i + 1; j < this.asteroids.length; j++) {
        if(Math.circleCollisionDetection(this.asteroids[i].x, this.asteroids[i].y, this.asteroids[i].radius, this.asteroids[j].x, this.asteroids[j].y, this.asteroids[j].radius)) {
          this.particleCollision(this.asteroids[i], this.asteroids[j]);
          this.audioController.trigger('collision');
        }
      }
    }

    //Checks for collisions between projectiles and asteroids
    for(let i = 0; i < this.projectiles.length; i++) {
      for(let j = 0; j < this.asteroids.length; j++) {
        if(Math.circleCollisionDetection(this.projectiles[i].x, this.projectiles[i].y, this.projectiles[i].radius, this.asteroids[j].x, this.asteroids[j].y, this.asteroids[j].radius)) {
          this.explode(this.projectiles[i].x, this.projectiles[i].y, this.projectiles[i].color);
          this.projectiles.splice(i, 1);
          this.explode(this.asteroids[j].x, this.asteroids[j].y, 'white');
          this.handleAsteriodExplosion(j);
          break;
        }
      }
    }

    if(!this.respawning) {
      //Check for ship crashing
      this.asteroids.forEach(asteroid => {
        if(Math.circleCollisionDetection(this.ship.x, this.ship.y, this.ship.radius, asteroid.x, asteroid.y, asteroid.radius)) {
          this.explode(this.ship.x, this.ship.y, this.ship.color);
          this.audioController.trigger('ship explosion');
          this.respawn();
        }
      });
    }

    //Check if a ship or UFO picks up a powerup
    for(let i = 0; i < this.powerups.length; i++) {
      if(Math.circleCollisionDetection(this.ship.x, this.ship.y, this.ship.radius, this.powerups[i].pos.x, this.powerups[i].pos.y, this.powerups[i].radius)) {
        this.explode(this.ship.x, this.ship.y, this.ship.color);
        this.ship.powerups[this.powerups[i].type] = true;
        this.ship.powerupTimers[this.powerups[i].type] += this.powerups[i].timer;
        if(this.powerups[i].type === 2) {
          this.ship.reloading = false;
          this.ship.rateOfFire = this.ship.RATE / 2
        }
        this.powerups.splice(i, 1);
        break;
      }
      for(let j = 0; j < this.ufos.length; j ++) {
        if(Math.circleCollisionDetection(this.ufos[j].x, this.ufos[j].y, this.ufos[j].radius, this.powerups[i].pos.x, this.powerups[i].pos.y, this.powerups[i].radius)) {
          this.explode(this.ufos[j].x, this.ufos[j].y, this.ufos[j].color);
          this.ufos[j].powerups[this.powerups[i].type] = true;
          this.ufos[j].powerupTimers[this.powerups[i].type] += this.powerups[i].timer;
          if(this.powerups[i].type === 2) {
            this.ufos[j].reloading = false;
            this.ufos[j].setRateOfFire();
          }
          this.powerups.splice(i, 1);
          break;
        }
      }
    }

    for(let i = 0; i < this.ufos.length; i++) {
      for(let j = 0; j < this.asteroids.length; j++) {
        if(this.detectShipCrash(this.ufos[i], this.asteroids[j])) {
          this.explode(this.ufos[i].x, this.ufos[i].y, this.ufos[i].color);
          this.destoryUFO(i);
          break;
        }
      }
    }

    if(this.ufos.length > 1) {
      for(let i = 0; i < this.ufos.length; i++) {
        for(let j = i + 1; j < this.ufos.length; j++) {
          if(Math.circleCollisionDetection(this.ufos[i].x, this.ufos[i].y, this.ufos[i].critical, this.ufos[j].x, this.ufos[j].y, this.ufos[j].critical)) {
            if(this.ufos[i].color === 'purple' && !this.ufos[i].reloading) {
              this.ufoProjectile(this.ufos[i], this.ufos[j].x, this.ufos[j].y);
            }
            if(this.ufos[j].color === 'purple' && !this.ufos[i].reloading) {
              this.ufoProjectile(this.ufos[j], this.ufos[i].x, this.ufos[i].y);
            }
            //Get the direction from the first ufo to the second.
            let dir = Math.getDirection(this.ufos[i].x, this.ufos[i].y, this.ufos[j].x, this.ufos[j].y)
            //Point the direction the other way
            this.ufos[i].alterPath(dir + Math.PI);
            //From the second ufo's perspective, this is pointing away from ufo 1
            this.ufos[j].alterPath(dir);
          }
        }
      }
    }

    if(!this.respawning) {
      this.ufos.forEach(ufo => {
        if(Math.circleCollisionDetection(this.ship.x, this.ship.y, this.ship.radius, ufo.x, ufo.y, ufo.radius)) {
          this.explode(this.ship.x, this.ship.y, this.ship.color);
          this.audioController.trigger('ship explosion');
          this.respawn();
        }
      });
    }

    //projectile ship collision checks
    for(let i = 0; i < this.projectiles.length; i++) {
      if(!this.respawning && Math.circleCollisionDetection(this.projectiles[i].x, this.projectiles[i].y, this.projectiles[i].radius,
        this.ship.x, this.ship.y, this.ship.radius)) {
        this.explode(this.ship.x, this.ship.y, this.ship.color);
        this.explode(this.projectiles[i].x, this.projectiles[i].y, this.projectiles[i].color);
        this.projectiles.splice(i, 1);
        this.audioController.trigger('ship explosion');
        this.respawn();
        break;
      }
      for(let j = 0; j < this.ufos.length; j ++) {
        if (Math.circleCollisionDetection(this.projectiles[i].x, this.projectiles[i].y, this.projectiles[i].radius,
          this.ufos[j].x, this.ufos[j].y, this.ufos[j].radius)) {
            this.explode(this.ufos[j].x, this.ufos[j].y, this.ufos[j].color);
            this.explode(this.projectiles[i].x, this.projectiles[i].y, this.projectiles[i].color);
            this.projectiles.splice(i, 1);
            this.destoryUFO(j);
            this.audioController.trigger('ship explosion');
            break;
        }
      }
    }

    //Input Map Applying
    //A or Left Arrow
    if(this.keyMap[65] || this.keyMap[37]){
      this.ship.velocity.dir -= 0.05;
      if(this.ship.velocity.dir <= -Math.PI * 2) {
        this.ship.velocity.dir = 0.0;
      }
    }
    //D or Right Arrow
    if(this.keyMap[68] || this.keyMap[39]) {
      this.ship.velocity.dir += 0.05;
      if(this.ship.velocity.dir >= Math.PI * 2) {
        this.ship.velocity.dir = 0.0;
      }
    }
    //W or Up Arrow
    if((this.respawnTimer <= 150 || !this.respawning)) {
      this.ship.boosting = false;
      if(this.keyMap[13] && this.ship.boost >= 0) {
        this.ship.velocity.mag = this.ship.thrust * 3;
        this.ship.boosting = true;
        this.ship.boost--;
        this.ship.updateSpeed();
        let numParticles = Math.floor(Math.randomBetween(4, 8));
        this.ship.createParticles(numParticles);
      }
      else if ((this.keyMap[87] || this.keyMap[38])) {
        this.ship.velocity.mag = this.ship.thrust;
        this.ship.updateSpeed();
        let numParticles = Math.floor(Math.randomBetween(1, 4));
        this.ship.createParticles(numParticles);
      }
    }
    //Space
    if(this.keyMap[32] && !this.ship.reloading && !this.respawning) {
      this.createProjectile();
      this.audioController.trigger('shoot');
    }
    //F
    if(this.keyMap[70] && this.teleports > 0 && !this.respawning && this.coolingDown === 50) {
      this.teleport();
      this.teleports--;
      this.coolingDown--;
    }
    //UFOs firing
    for(let i = 0; i < this.ufos.length; i++) {
      let ufo = this.ufos[i];
      ufo.rateOfFire--;
      if(ufo.rateOfFire <= 0) {
        if(ufo.color === 'purple' && this.ufos.length > 1 && Math.random() > 0.5) {
          if(i + 1 < this.ufos.length) {
            this.ufoProjectile(ufo, this.ufos[i + 1].x, this.ufos[i + 1].y);
          }
          else if (i - 1 >= 0) {
            this.ufoProjectile(ufo, this.ufos[i - 1].x, this.ufos[i - 1].y);
          }
        }
        else {
          this.ufoProjectile(ufo, this.ship.x, this.ship.y);
        }
        ufo.setRateOfFire();
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
      if(this.projectiles[i].color === 'green') {
        this.projectiles[i].update(this.ufos);
      }
      else {
        this.projectiles[i].update(this.ship);
      }
      if(this.projectiles[i].edgeDetection()) {
        this.projectiles.splice(i, 1);
      }
    }

    //update particles
    for(let j = 0; j < this.particles.length; j++) {
      this.particles[j].update();
      if(this.particles[j].life <= 0) {
        this.particles.splice(j, 1);
      }
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
    this.drawHUD();
    //Display respawning if needed
    if(this.respawning && !this.gameOver) {
      this.backBufferContext.save();
      this.backBufferContext.globalAlpha = 0.5;
      this.backBufferContext.strokeText("RESPAWNING", 350, 500);
      this.backBufferContext.restore();
    }
    //Draw UFOs
    this.ufos.forEach(ufo => {
      ufo.render(this.backBufferContext);
    });
    //Draw ship
    if(!this.respawning || this.respawnTimer <= 150) {
      this.ship.render(this.backBufferContext);
    }
    //Draw asteroids
    this.asteroids.forEach(asteroid => {
      asteroid.render(this.backBufferContext);
    });
    //draw projectiles
    this.projectiles.forEach(projectile => {
      projectile.render(this.backBufferContext);
    });
    this.powerups.forEach(powerup => {
      powerup.render(this.backBufferContext);
    });
    //draw particles
    this.particles.forEach(particle => {
      particle.render(this.backBufferContext);
    });
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
      this.screenBufferContext.font = "50px Times New Roman";
      this.screenBufferContext.strokeText("GAME OVER", 350, 500);
      this.screenBufferContext.strokeText("Retry? Press ~", 360, 600);
    }
    if(this.paused) {
      this.screenBufferContext.font = "50px Times New Roman";
      this.screenBufferContext.strokeText("Paused", 425, 600);
    }
  }
}
