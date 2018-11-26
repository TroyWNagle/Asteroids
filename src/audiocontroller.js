
/** @Class AudioController
  * Class to control all audio objects, updating & playing.
  */
export default class AudioController {
  /** @Constructor
    * No arguements. Loads all the audio files that will be needed.
    */
  constructor() {
    //Menu & Theme songs have been found @ https://freesound.org/
    this.menu = new Audio('./menu2.wav');
    this.pickTheme();

    //All Wav files below were created with BFXR
    //Array of sounds for simplifing manipulating the sounds in mass
    this.sounds = [];
    this.sounds.push(this.menu);
    this.over = new Audio('./gameOver.wav');
    this.sounds.push(this.over);
    this.collisionSound = new Audio('collision.wav');
    this.collisionSound.volume = 0.50;
    this.sounds.push(this.collisionSound);
    this.explosion = new Audio('./Explosion.wav');
    this.explosion.volume = 0.70;
    this.sounds.push(this.explosion);
    this.shipExplosion = new Audio('./shipExplosion.wav');
    this.sounds.push(this.shipExplosion);
    //this.laser = new Audio('./laserShoot.wav');
    this.ufoLaser = new Audio('./ufoShot.wav');
    this.sounds.push(this.ufoLaser);
    this.homing = new Audio('./homing.wav');
    this.homing.volume = 0.70;
    this.sounds.push(this.homing);
    this.teleportSound = new Audio('./teleport.wav');
    this.sounds.push(this.teleportSound);
    this.shieldBreak = new Audio('./shieldbreak.wav');
    this.sounds.push(this.shieldBreak);
    this.homingPickUp = new Audio('./homingpowerup.wav');
    this.sounds.push(this.homingPickUp);
  }

  /** @Function pickTheme()
    * Functon to handle picking one of the two themes.
    */
  pickTheme() {
    if(Math.random() > 0.5) {
      this.theme = new Audio('./theme.wav');
    }
    else {
      this.theme = new Audio('./theme2.wav');
    }
  }

  /** @Function playTheme()
    * Function to play the theme on a loop.
    */
  playTheme() {
    this.theme.volume = 0.1;
    this.theme.loop = true;
    this.theme.play();
  }

  /** @Function stopTheme
    * Functon to stop the theme from playing.
    */
  stopTheme() {
    this.theme.pause();
  }

  /** @Functon playMenu()
    * Functon to play the menu music on a loop.
    */
  playMenu() {
    this.menu.volume = 0.30;
    this.menu.loop = true;
    this.menu.play();
  }

  /** @Functon stopMenu()
    * Function to stop the menu music.
    */
  stopMenu() {
    this.menu.pause();
  }

  /** @Functon mute()
    * Function to mute all the sounds & music.
    */
  mute() {
    this.sounds.forEach(sound => {
      sound.muted = true;
    });
    this.theme.muted = true;
  }

  /** @Functon unmute()
    * Function to unmute all the sounds & music.
    */
  unmute() {
    this.sounds.forEach(sound => {
      sound.muted = false;
    });
    this.theme.muted = false;
  }

  /** @Functon trigger()
    * Function to trigger a specific sound effect.
    * @param {string} sound - the name of the sound that need to be played.
    */
  trigger(sound) {
    switch (sound) {
      case 'shoot':
        this.ufoLaser.play();
        break;
      case 'homing':
        this.homing.play();
        break;
      case 'homing pickup':
        this.homingPickUp.play();
        break;
      case 'collision':
        this.collisionSound.play();
        break;
      case 'explosion':
        this.explosion.play();
        break;
      case 'shield broken':
        this.shieldBreak.play();
        break;
      case 'ship explosion':
        this.shipExplosion.play();
        break;
      case 'teleport':
        this.teleportSound.play();
        break;
      case 'game over':
        this.over.play();
        break;
      default:

    }
  }
}
