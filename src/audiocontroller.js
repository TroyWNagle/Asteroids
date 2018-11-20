

export default class AudioController {
  constructor() {
    //Found this Wav file @ https://freesound.org/people/joshuaempyre/sounds/251461/
    if(Math.random() > 0.5) {
      this.theme = new Audio('./theme.wav');
    }
    else {
      this.theme = new Audio('./theme2.wav');
    }
    this.menu = new Audio('./menu2.wav');

    //All Wav files below were created with BFXR
    //Array of sounds for simplifing manipulating the sounds in mass
    this.sounds = [];
    this.sounds.push(this.theme);
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
    this.sounds.push(this.homing);
    this.teleportSound = new Audio('./teleport.wav');
    this.sounds.push(this.teleportSound);
    this.shieldBreak = new Audio('./shieldbreak.wav');
    this.sounds.push(this.shieldBreak);
    this.homingPickUp = new Audio('./homingpowerup.wav');
    this.sounds.push(this.homingPickUp);
  }

  playTheme() {
    this.theme.volume = 0.1;
    this.theme.loop = true;
    this.theme.play();
  }

  stopTheme() {
    this.theme.pause();
  }

  playMenu() {
    this.menu.volume = 0.30;
    this.menu.loop = true;
    this.menu.play();
  }

  stopMenu() {
    this.menu.pause();
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
