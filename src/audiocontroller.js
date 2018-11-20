

export default class AudioController {
  constructor() {
    //Found this Wav file @ https://freesound.org/people/joshuaempyre/sounds/251461/
    /*this.theme = new Audio('./theme.wav');
    this.theme.volume = 0.01;
    this.theme.loop = true;
    this.theme.play();*/
    //All Wav files below were created with BFXR
    //Array of sounds for simplifing manipulating the sounds in mass
    this.sounds = [];
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
    this.homing = new Audio('./homing.wav');
    this.sounds.push(this.ufoLaser);
    this.teleportSound = new Audio('./teleport.wav');
    this.shieldBreak = new Audio('./shieldbreak.wav');
    this.homingPickUp = new Audio('./homingpowerup.wav');
    this.sounds.push(this.teleportSound);
  }

  adjustMasterVolume(change) {
    this.sounds.forEach(sound => {
      sound.volume += change;
      if(sound.volume < 0.0) {
        sound.volume = 0.0;
      }
      if(sound.volume > 1.0) {
        sound.volume = 1.0;
      }
    });
  }

  mute() {
    this.sounds.forEach(sound => {
      sound.muted = true;
    });
  }

  unmute() {
    this.sounds.forEach(sound => {
      sound.muted = false;
    });
  }

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
