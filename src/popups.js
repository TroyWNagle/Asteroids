
/** @Class PopUp
  * Object to handle text that pops up, giving the player information.
  */
export default class PopUp {
  /** @Constructor
    * Initializes the Pop up object & key variables.
    * @param {floats} x, y - position variables.
    * @param {string} string - what needs to be displayed
    * @param {string} type - helps set certai variables for different types of pop ups.
    */
  constructor(x, y, string, type) {
    this.x = x;
    this.y = y;
    this.type = type;
    this.string = '';
    //How long the pop up will laster (int)
    this.life = 0;
    //Size of the font used to display the text. (int)
    this.size = 0;
    this.initSettings(string);
    this.color = 'yellow';
  }

  /** @Function initSettings()
    * Handles the setting up of variables that depend on the type of pop up.
    * @param {string} string - information that needs to be displayed.
    */
  initSettings(string) {
    switch (this.type) {
      //Short lived pop ups.
      case "blip":
        this.life = 40;
        this.size = 25;
        this.string = '+ ' + string;
        break;
      //Longer lived, more important pop ups.
      case "annoucement":
        //Respawning pop up is set to 300 to match the actual respawn timer.
        if(string === 'RESPAWNING') {
          this.life = 300;
        }
        else {
          this.life = 120;
        }
        this.size = 50;
        this.string = string;
        break;
      default:

    }
  }

  /** @Function update()
    * Handles the decrementing of the pop ups life. When it returns true, the pop up needs to be removed.
    */
  update() {
    this.life--;
    if(this.life <= 0) {
      return true;
    }
  }

  /** @Function render()
    * Handles the drawing of the pop up to the screen.
    * @param {Canvas Context} ctx - backBufferContext
    */
  render(ctx) {
    ctx.save();
    ctx.fillStyle = this.color;
    ctx.font = this.size + "px Arial";
    ctx.fillText(this.string, this.x, this.y);
    ctx.restore();
  }
}
