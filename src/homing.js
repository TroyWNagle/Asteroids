import Projectile from "./projectile.js"

/** @Class Homing
  * Homing is a subclass of Projectile. It seeks out targets rather than flying in straight lines.
  * Homing objects also have line trail effect instead of a particle trail effect to distiguish them from their parent objects.
  */
export default class Homing extends Projectile {
  /** @Constructor
    * Sets up the Homing object
    * @param {floats} x, y - position variables.
    * @param {floats} direction - indicates the starting direction of travel.
    * @param {string} color - the color the projectile will be.
    */
  constructor(x, y, direction, color) {
    //Call super class.
    super(x, y, direction, color);
    // 0.0174533 is 1 degree in radians
    this.correction = 0.0174533 * 1.25;
    //Initially doesn't have a target.
    this.target = null;
    //Stores its past to make a trail effect.
    this.past = [];
    //Variable to help with the trail effect.
    this.width = 1;
  }

  /** @Function findTarget()
    * Finds the closest Target
    * @param {UFO} targets - will always be a array of UFOS
    */
  findTarget(targets) {
    let shortest = 10000
    for(let i = 0; i < targets.length; i++) {
      let distance = 0;
      //Checks if the potential tartget is already the one it has.
      if(this.target !== targets[i]) {
        //If not, calculate the distance to target.
        distance = this.findDistance(targets[i]);
      }
      //If the target is closer than other targets
      if(distance < shortest) {
        this.target = targets[i]
        shortest = distance
      }
    }
    if(shortest === 10000) {
      this.target = null
    }
  }

  /** @Function findDistance()
    * Finds the distance to the target.
    * @param {Ship} target - will be a ship object, Player or UFO
    */
  findDistance(target) {
    let dx = this.x - target.x
    let dy = this.y - target.y
    let distance = Math.sqrt(dx * dx + dy * dy)
    return distance
  }

  /** @Function findDirection()
    * Finds the direction to the target.
    * @param {Ship} target - will be a ship object, Player or UFO
    */
  findDirection(target) {
    let dx = this.x - target.x
    let dy = this.y - target.y
    let distance = Math.sqrt(dx * dx + dy * dy)
    let direction = Math.acos(dy / distance)
    if(dx > 0) {
      direction *= -1
    }
    if( direction < 0) {
      direction += Math.tau
    }
    return direction;
  }

  /** @Function adjustDirection()
    * Adjusts the projectiles direction to track a target.
    */
  adjustDirection() {
    //Gets a directio to the target
    let direction = this.findDirection(this.target);
    //Make the current travel direction positive for simplicity
    if(this.velocity.dir < 0) {
      this.velocity.dir += Math.tau
    }
    //Calculate the angle difference
    let delta = this.velocity.dir - direction
    //Determine to turn lect for right based on the delta.
    if(delta > Math.PI) {
      delta -= Math.tau
    }
    if(delta < -Math.PI) {
      delta += Math.tau
    }
    //Adjust the direction as long as the Absolute value of delta > 0
    if(delta > 0) {
      this.velocity.dir -= this.correction;
    }
    if(delta < 0) {
      this.velocity.dir += this.correction;
    }
  }

  /** @Function storePast()
    * Stores the past of the projectile for the trail effect.
    */
  storePast() {
    let point = {x: this.x, y: this.y};
    this.past.push(point);
    if(this.past.length > 30) {
      this.past.splice(0, 1);
    }
  }

  /** @function alterPath()
    * Add some noise to the path.
    */
  alterPast() {
    this.past.forEach(point => {
      point.x += Math.randomBetween(-1, 1);
      point.y += Math.randomBetween(-1, 1);
    });
  }

  /** @Function update()
    * Function to update everything on a frame to frame basis.
    * @param {Ship / array of Ships} targets - could be the single player ship, or the array of UFOs
    */
  update(targets) {
    //Check if it is the player's projectile.
    if(this.color === 'green') {
      //Search for UFOSs
      if(targets.length > 0) {
        this.findTarget(targets);
      }
    }
    else {
      //Otherwise, it is a UFO projectile & it only seeks out the player.
      this.target = targets;
    }
    //If you have a target, seek it out.
    if(this.target) {
      this.adjustDirection();
      super.initSpeed();
    }
    //Store the past
    this.storePast();
    this.x += this.speed.x;
    this.y += this.speed.y;
    //Create some noise on the past.
    this.alterPast();
  }

  /** @Function render()
    * Function to render everything about the projectile.
    * @param {canvas context} ctx - backBufferContext
    */
  render(ctx) {
    super.render(ctx);
    ctx.save();
    ctx.strokeStyle = this.color;
    ctx.lineWidth = this.width;
    //Render the past
    for(let i = 0; i < this.past.length - 1; i++) {
      ctx.beginPath();
      ctx.moveTo(this.past[i].x, this.past[i].y);
      ctx.lineTo(this.past[i + 1].x, this.past[i + 1].y);
      ctx.stroke();
      //Slowly increase the width of the trail.
      ctx.lineWidth += 0.1;
    }
    ctx.restore();
  }
}
