
/** @Class PowerUpDisplay
  * Object to display the players active power ups.
  */
export default class PowerUpDisplay {
  /** @Constructor
    * Initializes the power up display object.
    * @param {floats} x, y - position variables.
    * @param {int} type - time of the power up. 1 = Homing, 2 = Rapid Fire, 3 = Shield
    * @param {int} timer - number of frames the power up is still active.
    */
  constructor(x, y, type, timer) {
    this.x = x;
    this.y = y;
    this.timer = timer;
    this.type = type;
    this.initColor();
  }

  /** @Function initColor()
    * Handles the assigning of the color & string variables for displaying.
    */
  initColor() {
    switch (this.type) {
      case 1:
        this.color = 'red';
        this.string = 'Homing: ';
        break;
      case 2:
        this.color = 'green';
        this.string = 'Rapid: '
        break;
      case 3:
        this.color = 'magenta';
        this.string = 'Shield: ';
        break;
      default:

    }
  }

  /** @Function render()
    * Draws the object to the screen.
    * @param {Canvas Context} ctx - backBufferContext
    */
  render(ctx) {
    ctx.save();
    ctx.fillStyle = this.color;
    ctx.font = "25px Arial";
    ctx.globalAlpha = 0.60;
    ctx.fillText(this.string + (this.timer / 60).toFixed(1), this.x, this.y);
    ctx.restore();
  }
}
