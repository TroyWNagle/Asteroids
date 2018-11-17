import Projectile from "./projectile.js"


export default class Homing extends Projectile {
  constructor(x, y, direction, color) {
    super(x, y, direction, color);
    // 0.0174533 is 1 degree in radians
    this.correction = 0.0174533 * 1.5;
    this.target = null;
    this.past = [];
    this.width = 1;
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
      direction += Math.tau
    }
    return direction;
  }

  adjustDirection() {
    let direction = this.findDirection(this.target);
    if(this.velocity.dir < 0) {
      this.velocity.dir += Math.tau
    }
    let delta = this.velocity.dir - direction
    if(delta > Math.PI) {
      delta -= Math.tau
    }
    if(delta < -Math.PI) {
      delta += Math.tau
    }
    if(delta > 0) {
      this.velocity.dir -= this.correction;
    }
    if(delta < 0) {
      this.velocity.dir += this.correction;
    }
  }

  storePast() {
    let point = {x: this.x, y: this.y};
    this.past.push(point);
    if(this.past.length > 30) {
      this.past.splice(0, 1);
    }
  }

  alterPast() {
    this.past.forEach(point => {
      point.x += Math.randomBetween(-1, 1);
      point.y += Math.randomBetween(-1, 1);
    });
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
    this.storePast();
    this.x += this.speed.x;
    this.y += this.speed.y;
    this.alterPast();
  }

  render(ctx) {
    super.render(ctx);
    ctx.save();
    ctx.strokeStyle = this.color;
    ctx.lineWidth = this.width;
    for(let i = 0; i < this.past.length - 1; i++) {
      ctx.beginPath();
      ctx.moveTo(this.past[i].x, this.past[i].y);
      ctx.lineTo(this.past[i + 1].x, this.past[i + 1].y);
      ctx.stroke();
      ctx.lineWidth += 0.1;
    }
    ctx.restore();
  }
}
