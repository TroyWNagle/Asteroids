//Custom math functions library


/** @function Math.randomBetween
  * Math prototype function built to easily create ranom floats
  * @param {float} min - the lowest number you want
  * @param {float} max - the highest number you want (I beleive it is non-inclusive)
  * @returns random float between the parameters
  */
Math.randomBetween = function (min, max) {
  return Math.random() * (max - min) + min;
};

/** @function Math.randomInt
  * Math prototype function built to easily create random integers
  * @param {float} min - the lowest number you want
  * @param {float} max - the highest number you want (I beleive it is non-inclusive)
  * @returns random integer between the parameters
  */
Math.randomInt = function (min, max) {
  let lowest = Math.floor(min);
  let highest = Math.ceil(max);
  return Math.round(Math.random() * (highest - lowest)) + lowest;
};

/** @function Math.getDirection
  * Math prototype funciton to get the direction between two points/objects
  * @param {float} x - x position of object 1
  * @param {float} y - y position of object 1
  * @param {float} x2 - x position of object 2
  * @param {float} y2 - y position of object 2
  */
Math.getDirection = function(x, y, x2, y2) {
  //Get relative Distances
  let dx = x - x2;
  let dy = y - y2;
  //Find hyp. of triangle
  let dist = Math.sqrt(dx * dx + dy * dy);
  //arcCosine of dy & hyp.
  let direction = Math.acos(dy/dist);
  //Flip the direction based on the relative x
  if(dx > 0) {
    direction *= -1;
  }
  if( direction < 0) {
    direction += Math.PI * 2
  }
  return direction;
};

/** @function circleCollisionDetection
  * Function to detect collisions between two circles, kept as general
  * as possible for maximum versatility
  * @param {float} x1 - x position of object 1
  * @param {float} y1 - y position of object 1
  * @param {int/float} r1 - radius of object 1
  * @param {float} x2 - x position of object 2
  * @param {float} y2 - y position of object 2
  * @param {int/float} r2 - radius of object 2
  */
Math.circleCollisionDetection = function(x1, y1, r1, x2, y2, r2) {
  var dx = x1 - x2;
  var dy = y1 - y2;
  //Quick check to avoid having to square things
  if(dx > r1 + r2 || dy > r1 + r2) {
    return false;
  }
  //More accurate check
  if(dx * dx + dy * dy >= (r1 + r2) * (r1 + r2)) {
    return false;
  }
  return true;
}

/** @function circleRectangleCollision
* funciton to handle collisions between circles and rectangles, which are pretty much just buttons
* Again kept as general as possible for maximum versatility
* @param {float} cx - x position of circle
* @param {float} xy - y position of circle
* @param {int/float} cr - radius of circle
* @param {float} rx - x position of rectangle top left corner
* @param {float} ry - y position of rectangle top left corner
* @param {int} rw - width of rectangle
* @param {int} rh - height of rectangle
*/
Math.circleRectangleCollision = function(cx, cy, cr, rx, ry, rw, rh) {
  //Find the center of the button
  let rec = {x: rx + rw / 2, y: ry + rh / 2}
  //Distances between centers
  let dx = Math.abs(cx - rec.x);
  let dy = Math.abs(cy - rec.y);

  //Broad distance check
  if (dx > (rw / 2 + cr)) { return false; }
  if (dy > (rh / 2 + cr)) { return false; }

  //Single dimension checks
  if (dx <= (rw / 2)) { return true; }
  if (dy <= (rh / 2)) { return true; }

  //Corner Check
  let dist = Math.pow((dx - rw / 2) , 2) + Math.pow((dy - rh / 2), 2);
  return (dist <= (cr * cr));
}
