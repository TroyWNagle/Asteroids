import Projectile from "./projectile.js"


export default class Homing extends Projectile {
  constructor(x, y, direction, color) {
    super(x, y, direction, color);
    // 0.0174533 is 1 degree in radians
    this.correction = 0.0174533 * 1.5;
    this.target = null;
  }

  findTarget(targets) {
    let shortest = 10000
    for(let i = 0; i < targets.length; i++) {
      let distance = 0;
      if(this.target !== targets[i]) {
        distance = this.findDistance(targets[i]);
      }
      if(distance < shortest) {
        this.target = targets[i]
        shortest = distance
      }
    }
    if(shortest === 10000) {
      this.target = null
    }
  }

  findDistance(target) {
    let dx = this.x - target.x
    let dy = this.y - target.y
    let distance = Math.sqrt(dx * dx + dy * dy)
    return distance
  }

  findDirection(target) {
    let dx = this.x - target.x
    let dy = this.y - target.y
    let distance = Math.sqrt(dx * dx + dy * dy)
    let direction = Math.acos(dy / distance)
    if(dx > 0) {
      direction *= -1
    }
    if( direction < 0) {
      direction += Math.PI * 2
    }
    return direction;
  }

  adjustDirection() {
    let direction = this.findDirection(this.target);
    if(this.velocity.dir < 0) {
      this.velocity.dir += Math.PI * 2
    }
    let delta = this.velocity.dir - direction
    if(delta > Math.PI) {
      delta -= Math.PI * 2
    }
    if(delta < -Math.PI) {
      delta += Math.PI * 2
    }
    if(delta > 0) {
      this.velocity.dir -= this.correction;
    }
    if(delta < 0) {
      this.velocity.dir += this.correction;
    }
  }

  update(targets) {
    if(this.color === 'green') {
      if(targets.length > 0) {
        this.findTarget(targets);
      }
    }
    else {
      this.target = targets;
    }
    if(this.target) {
      this.adjustDirection();
      super.initSpeed();
    }
    super.update(targets)
  }
}
