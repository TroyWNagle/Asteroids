/** @Class HUDObject
  * Object to hold information about some essential variables and display them to the player.
  */
export default class HUDObject {
  /** @Constructor
    * Initializes the key variables
    * @param {floats/ints} x, y - position variables
    * @param {string} type - the name of the variable displayed
    * @param {int} information - value held by each variable.
    */
  constructor(x, y, type, information) {
    this.x = x;
    this.y = y;
    this.type = type;
    this.info = information;
  }

  /** @Functon Render()
    * Draws the HUDObject to the screen
    * @param {Canvas Context} ctx - backBufferContext
    */
  render(ctx) {
    ctx.save();
    ctx.fillStyle = 'yellow';
    ctx.font = "30px Arial";
    ctx.globalAlpha = 0.70;
    ctx.fillText(this.type + this.info, this.x, this.y);
    ctx.restore();
  }
}
