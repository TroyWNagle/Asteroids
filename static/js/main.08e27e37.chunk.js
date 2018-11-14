(window.webpackJsonp=window.webpackJsonp||[]).push([[0],[function(t,i,s){t.exports=s(4)},function(t,i){Math.randomBetween=function(t,i){return Math.random()*(i-t)+t},Math.randomInt=function(t,i){var s=Math.floor(t),e=Math.ceil(i);return Math.round(Math.random()*(e-s))+s},Math.getDirection=function(t,i,s,e){var h=t-s,o=i-e,r=Math.sqrt(h*h+o*o),a=Math.acos(o/r);return h>0&&(a*=-1),a<0&&(a+=2*Math.PI),a},Math.getDistance=function(t,i,s,e){var h=t-s,o=i-e;return Math.sqrt(h*h+o*o)},Math.circleCollisionDetection=function(t,i,s,e,h,o){var r=t-e,a=i-h;return!(r>s+o||a>s+o)&&!(r*r+a*a>=(s+o)*(s+o))},Math.circleRectangleCollision=function(t,i,s,e,h,o,r){var a=e+o/2,n=h+r/2,c=Math.abs(t-a),l=Math.abs(i-n);return!(c>o/2+s)&&(!(l>r/2+s)&&(c<=o/2||(l<=r/2||Math.pow(c-o/2,2)+Math.pow(l-r/2,2)<=s*s)))}},function(t,i,s){},,function(t,i,s){"use strict";function e(t,i){if(!(t instanceof i))throw new TypeError("Cannot call a class as a function")}function h(t,i){for(var s=0;s<i.length;s++){var e=i[s];e.enumerable=e.enumerable||!1,e.configurable=!0,"value"in e&&(e.writable=!0),Object.defineProperty(t,e.key,e)}}function o(t,i,s){return i&&h(t.prototype,i),s&&h(t,s),t}s.r(i);var r=function(){function t(i,s,h,o,r,a){e(this,t),this.startX=i,this.startY=s,this.x=i,this.y=s,this.life=a,this.color=r,this.alpha=1,this.values={high:1,low:.7},this.clock=10,this.speed=Math.randomInt(0,o),this.direction=h,this.speedX=Math.cos(h)*this.speed,this.speedY=-Math.sin(h)*this.speed}return o(t,[{key:"changeAlpha",value:function(){this.alpha===this.values.high?this.alpha=this.values.low:this.alpha=this.values.high}},{key:"updateSpeed",value:function(){this.speedX=Math.cos(this.direction)*this.speed,this.speedY=-Math.sin(this.direction)*this.speed}},{key:"update",value:function(){this.clock--,this.clock<=0&&(this.clock=10,this.changeAlpha()),this.life--,this.speed>0&&(this.speed-=.05,this.updateSpeed()),this.x+=this.speedX,this.y+=this.speedY}},{key:"render",value:function(t){t.save(),t.fillStyle=this.color,t.globalAlpha=this.alpha,t.beginPath(),t.arc(this.x,this.y,1,0,2*Math.PI),t.closePath(),t.fill(),t.restore()}}]),t}(),a=function(){function t(){e(this,t),this.x=500,this.y=500,this.RATE=40,this.reloading=!1,this.rateOfFire=this.RATE,this.accel={mag:.1,dir:0},this.velocity={mag:0,dir:0},this.speed={x:0,y:0},this.radius=15,this.particles=[],this.color="green",this.MAXBOOST=120,this.boosting=!1,this.boost=120,this.TOPSPEED=3,this.powerups={1:!1,2:!1,3:!1},this.powerupTimers={1:0,2:0,3:0}}return o(t,[{key:"updateSpeed",value:function(t){this.speed.y+=-Math.cos(this.accel.dir)*t,this.speed.x+=Math.sin(this.accel.dir)*t,Math.abs(this.speed.x)>=this.TOPSPEED&&(this.speed.x<0?this.speed.x=-this.TOPSPEED:this.speed.x=this.TOPSPEED),Math.abs(this.speed.y)>=this.TOPSPEED&&(this.speed.y<0?this.speed.y=-this.TOPSPEED:this.speed.y=this.TOPSPEED)}},{key:"edgeDetection",value:function(){this.x<=-this.radius&&(this.x=1e3),this.y<=-this.radius&&(this.y=1e3),this.x>=1e3+this.radius&&(this.x=0),this.y>=1e3+this.radius&&(this.y=0)}},{key:"createParticles",value:function(t){for(var i=this.x-Math.sin(this.accel.dir)*this.radius,s=this.y+Math.cos(this.accel.dir)*this.radius,e=0;e<t;e++){var h=i+Math.randomBetween(-3,3),o=s+Math.randomBetween(-3,3),a=this.accel.dir+Math.randomBetween(-.174533,.174533);this.boosting&&this.boost>0?this.particles.push(new r(h,o,Math.PI+a,3,"blue",35)):this.particles.push(new r(h,o,Math.PI+a,1,"red",20))}}},{key:"checkPowerUps",value:function(){for(var t=1;t<=2;t++)this.powerups[t]&&(this.powerupTimers[t]--,this.powerupTimers[t]<=0&&(this.powerups[t]=!1))}},{key:"updateVelocity",value:function(){var t=Math.sqrt(this.speed.x*this.speed.x+this.speed.y*this.speed.y),i=Math.acos(this.speed.y/t);this.speed.x<0&&(i*=-1),i<0&&(i+=2*Math.PI),this.velocity.mag=t,this.velocity.dir=i}},{key:"update",value:function(){this.edgeDetection(),this.x+=this.speed.x,this.y+=this.speed.y,this.updateVelocity(),this.checkPowerUps(),this.reloading&&(this.rateOfFire--,this.rateOfFire<=0&&(this.powerups[2]?this.rateOfFire=this.RATE/2:this.rateOfFire=this.RATE,this.reloading=!1)),!this.boosting&&this.boost<this.MAXBOOST&&this.boost++;for(var t=0;t<this.particles.length;t++)this.particles[t].update(),this.particles[t].life<=0&&this.particles.splice(t,1)}},{key:"drawShield",value:function(t){t.save(),t.fillStyle="magenta",t.globalAlpha=.1,t.beginPath(),t.arc(this.x,this.y,1.3*this.radius,0,2*Math.PI),t.closePath(),t.fill(),t.restore()}},{key:"render",value:function(t){t.save(),t.strokeStyle=this.color,t.beginPath(),t.translate(this.x,this.y),t.rotate(this.accel.dir),t.moveTo(0,-this.radius),t.lineTo(10,this.radius),t.lineTo(0,this.radius/1.5),t.lineTo(-10,this.radius),t.lineTo(0,-this.radius),t.stroke(),t.restore(),this.particles.forEach(function(i){i.render(t)}),this.powerups[3]&&this.drawShield(t)}}]),t}(),n=function(){function t(i,s,h,o){e(this,t),this.x=i,this.y=s,this.destroyed=!1,h<5&&(h=5),this.mass=h,this.radius=h,this.surfacePath=[],this.createSurface(),this.direction=o,this.velocity={x:0,y:0},this.angle=0,-1===this.direction?this.initVelocity():this.explodedVelocity()}return o(t,[{key:"initVelocity",value:function(){var t=Math.randomInt(8,10)/this.mass;this.x<0?this.velocity.x=Math.randomBetween(1,t):this.x>1e3+this.radius?this.velocity.x=-Math.randomBetween(1,t):this.velocity.x=Math.randomBetween(-t,t),this.y<0?this.velocity.y=Math.randomBetween(1,t):this.y>1e3+this.radius?this.velocity.y=-Math.randomBetween(1,t):this.velocity.y=Math.randomBetween(-t,t)}},{key:"createSurface",value:function(){for(var t,i,s=2*Math.PI/24,e=this.radius,h=0;h<24;h++)Math.randomInt(0,100)>70&&(e=Math.randomBetween(.8*this.radius,this.radius)),t=Math.cos(h*s)*e,i=-Math.sin(h*s)*e,this.surfacePath.push({x:t,y:i})}},{key:"explodedVelocity",value:function(){var t=Math.randomInt(9,12)/this.mass;this.velocity.x=Math.cos(this.direction)*t,this.velocity.y=-Math.sin(this.direction)*t}},{key:"edgeDetection",value:function(){this.x>=1e3+2.5*this.radius?this.x=-2.4*this.radius:this.x<=-2.5*this.radius&&(this.x=1e3+2.4*this.radius),this.y>=1e3+2.5*this.radius?this.y=-2.4*this.radius:this.y<=-2.5*this.radius&&(this.y=1e3+2.4*this.radius)}},{key:"update",value:function(){this.edgeDetection(),this.velocity.x>0?this.angle+=.01:this.angle-=.01,this.x+=this.velocity.x,this.y+=this.velocity.y}},{key:"render",value:function(t){t.save(),t.strokeStyle="white",t.translate(this.x,this.y),t.rotate(this.angle),t.beginPath(),t.moveTo(this.surfacePath[0].x,this.surfacePath[0].y);for(var i=1;i<this.surfacePath.length;i++)t.lineTo(this.surfacePath[i].x,this.surfacePath[i].y);t.closePath(),t.stroke(),t.restore()}}]),t}(),c=function(){function t(i,s,h,o){e(this,t),this.x=i,this.y=s,this.radius=3.5,this.color=o,h<0&&(h+=2*Math.PI),this.velocity={mag:5,dir:h},this.speed={x:0,y:0},this.initSpeed(),this.particles=[]}return o(t,[{key:"createParticles",value:function(t){for(var i=this.x-Math.sin(this.velocity.dir)*this.radius,s=this.y+Math.cos(this.velocity.dir)*this.radius,e=0;e<t;e++){var h=i+Math.randomBetween(-this.radius,this.radius),o=s+Math.randomBetween(-this.radius,this.radius);this.particles.push(new r(h,o,Math.PI*this.velocity.dir,1,this.color,10))}}},{key:"initSpeed",value:function(){this.speed.x=Math.sin(this.velocity.dir)*this.velocity.mag,this.speed.y=-Math.cos(this.velocity.dir)*this.velocity.mag}},{key:"edgeDetection",value:function(){return this.x+this.radius>=1e3||this.x-this.radius<=0||this.y+this.radius>=1e3||this.y-this.radius<=0}},{key:"update",value:function(t){this.createParticles(Math.randomInt(3,6)),this.x+=this.speed.x,this.y+=this.speed.y;for(var i=0;i<this.particles.length;i++)this.particles[i].update(),this.particles[i].life<=0&&this.particles.splice(i,1)}},{key:"render",value:function(t){t.save(),t.strokeStyle=this.color,t.beginPath(),t.arc(this.x,this.y,this.radius,0,2*Math.PI),t.closePath(),t.stroke(),t.restore(),this.particles.forEach(function(i){i.render(t)})}}]),t}();function l(t){return(l="function"===typeof Symbol&&"symbol"===typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"===typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function u(t){return(u="function"===typeof Symbol&&"symbol"===l(Symbol.iterator)?function(t){return l(t)}:function(t){return t&&"function"===typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":l(t)})(t)}function p(t,i){return!i||"object"!==u(i)&&"function"!==typeof i?function(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}(t):i}function d(t){return(d=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}function f(t,i,s){return(f="undefined"!==typeof Reflect&&Reflect.get?Reflect.get:function(t,i,s){var e=function(t,i){for(;!Object.prototype.hasOwnProperty.call(t,i)&&null!==(t=d(t)););return t}(t,i);if(e){var h=Object.getOwnPropertyDescriptor(e,i);return h.get?h.get.call(s):h.value}})(t,i,s||t)}function y(t,i){return(y=Object.setPrototypeOf||function(t,i){return t.__proto__=i,t})(t,i)}function v(t,i){if("function"!==typeof i&&null!==i)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(i&&i.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),i&&y(t,i)}var x=function(t){function i(t,s,h,o){var r;return e(this,i),(r=p(this,d(i).call(this,t,s,h,o))).correction=.02617995,r.target=null,r}return v(i,c),o(i,[{key:"findTarget",value:function(t){for(var i=1e4,s=0;s<t.length;s++){var e=0;this.target!==t[s]&&(e=this.findDistance(t[s])),e<i&&(this.target=t[s],i=e)}1e4===i&&(this.target=null)}},{key:"findDistance",value:function(t){var i=this.x-t.x,s=this.y-t.y;return Math.sqrt(i*i+s*s)}},{key:"findDirection",value:function(t){var i=this.x-t.x,s=this.y-t.y,e=Math.sqrt(i*i+s*s),h=Math.acos(s/e);return i>0&&(h*=-1),h<0&&(h+=2*Math.PI),h}},{key:"adjustDirection",value:function(){var t=this.findDirection(this.target);this.velocity.dir<0&&(this.velocity.dir+=2*Math.PI);var i=this.velocity.dir-t;i>Math.PI&&(i-=2*Math.PI),i<-Math.PI&&(i+=2*Math.PI),i>0&&(this.velocity.dir-=this.correction),i<0&&(this.velocity.dir+=this.correction)}},{key:"update",value:function(t){"green"===this.color?t.length>0&&this.findTarget(t):this.target=t,this.target&&(this.adjustDirection(),f(d(i.prototype),"initSpeed",this).call(this)),f(d(i.prototype),"update",this).call(this,t)}}]),i}(),g=function(t){function i(t,s){var h;return e(this,i),(h=p(this,d(i).call(this))).x=t,h.y=s,h.rotation=0,h.accel={mag:0,dir:0},h.acceleration=.2,h.asteroid="",h.innerRadius=10,h.radius=25,h.bufferRadius=60,h.critical=40,h.color="",h.clock=0,h.bounty=0,h.setColor(),h.setClock(),h.rateOfFire=0,h.setRateOfFire(),h.lineSegments=[],h.initLineSegments(),h.goal="",h.initVelocity(),h}return v(i,a),o(i,[{key:"setColor",value:function(){var t,i=Math.randomInt(0,101);i>90?(t="fuchsia",this.bounty=500):i>85?(t="purple",this.bounty=200):i>45?(t="blue",this.bounty=150):(t="orange",this.bounty=100),this.color=t}},{key:"setClock",value:function(){this.CLOCK=0,"purple"===this.color||"fuchsia"===this.color?(this.CLOCK=5,this.clock=this.CLOCK):"blue"===this.color?(this.CLOCK=30,this.clock=this.CLOCK):(this.CLOCK=60,this.clock=this.CLOCK)}},{key:"setRateOfFire",value:function(){"purple"===this.color||"fuchsia"===this.color?this.rateOfFire=Math.randomInt(150,350):"blue"===this.color?this.rateOfFire=Math.randomInt(300,700):this.rateOfFire=Math.randomInt(300,500),this.powerups[2]&&(this.rateOfFire=Math.round(this.rateOfFire/2))}},{key:"initLineSegments",value:function(){for(var t,i,s,e,h=0;h<6;h++){var o=Math.cos(h*Math.PI/3),r=Math.sin(h*Math.PI/3);t=o*this.innerRadius,i=o*this.radius,s=-r*this.innerRadius,e=-r*this.radius,this.lineSegments.push({xI:t,xF:i,yI:s,yF:e})}}},{key:"initVelocity",value:function(){this.goal={x:Math.randomBetween(200,800),y:Math.randomBetween(200,800)}}},{key:"updateSpeed",value:function(){this.speed.y+=-Math.cos(this.accel.dir)*this.accel.mag,this.speed.x+=Math.sin(this.accel.dir)*this.accel.mag,Math.abs(this.speed.x)>=1.5&&(this.speed.x<0?this.speed.x=-1.5:this.speed.x=1.5),Math.abs(this.speed.y)>=1.5&&(this.speed.y<0?this.speed.y=-1.5:this.speed.y=1.5)}},{key:"edgeDetection",value:function(){(this.x+this.bufferRadius>=1e3&&this.speed.x>0||this.x-this.bufferRadius<=0&&this.speed.x<0)&&(this.speed.x*=-1,this.accel.dir+=Math.PI/2,this.accel.mag=0),(this.y+this.bufferRadius>=1e3&&this.speed.y>0||this.y-this.bufferRadius<=0&&this.speed.y<0)&&(this.speed.y*=-1,this.accel.dir+=Math.PI/2,this.accel.mag=0)}},{key:"checkCollisions",value:function(t,i,s){for(var e=0;e<t.length;e++)if(Math.circleCollisionDetection(i,s,this.critical,t[e].x,t[e].y,t[e].radius))return!0;return!1}},{key:"goToGoal",value:function(){this.accel.dir=Math.getDirection(this.x,this.y,this.goal.x,this.goal.y),this.accel.mag=this.acceleration,Math.getDistance(this.x,this.y,this.goal.x,this.goal.y)<this.radius&&(this.goal="")}},{key:"alterPath",value:function(t){this.accel.mag=this.acceleration,this.accel.dir=t,""!==this.goal&&(this.setClock(),this.clock--)}},{key:"catchAsteroid",value:function(t){this.asteroid=t,this.asteroid.velocity.x=this.speed.x,this.asteroid.velocity.y=this.speed.y}},{key:"orbitAsteroid",value:function(){var t=Math.getDirection(this.x,this.y,this.asteroid.x,this.asteroid.y),i=Math.getDistance(this.x,this.y,this.asteroid.x,this.asteroid.y),s=this.x+Math.sin(t+.02)*i,e=this.y-Math.cos(t+.02)*i;this.asteroid.x=s,this.asteroid.y=e}},{key:"checkAsteroidAlignment",value:function(t){var i=Math.getDirection(this.x,this.y,this.asteroid.x,this.asteroid.y),s=i-Math.getDirection(this.x,this.y,t.x,t.y);if(Math.abs(s)<5*Math.PI/180){var e=30/this.asteroid.mass;this.speed.y+=-Math.cos(this.accel.dir)*this.accel.mag,this.speed.x+=Math.sin(this.accel.dir)*this.accel.mag,this.asteroid.velocity.x=Math.sin(i)*e,this.asteroid.velocity.y=-Math.cos(i)*e,this.asteroid=""}}},{key:"createParticles",value:function(t){for(var i=0;i<t;i++){var s=this.velocity.dir+Math.randomBetween(-Math.PI,0),e=this.x-Math.cos(s)*this.radius,h=this.y+Math.sin(s)*this.radius;this.particles.push(new r(e,h,Math.PI+this.velocity.dir,.7*this.velocity.mag,this.color,30))}}},{key:"asteroidParticles",value:function(t){for(var i=this.asteroid.x,s=this.asteroid.y,e=0;e<t;e++){var h=Math.randomBetween(0,2*Math.PI),o=i+Math.cos(h)*this.asteroid.radius,a=s-Math.sin(h)*this.asteroid.radius;this.particles.push(new r(o,a,h+Math.PI/6,2,this.color,20))}}},{key:"update",value:function(){this.edgeDetection(),this.updateSpeed(),f(d(i.prototype),"checkPowerUps",this).call(this),f(d(i.prototype),"updateVelocity",this).call(this),this.clock<this.CLOCK&&(this.clock--,this.clock<=0&&this.setClock()),this.clock===this.CLOCK&&""!==this.goal&&this.goToGoal(),this.reloading&&(this.rateOfFire--,this.rateOfFire<=0&&(this.setRateOfFire(),this.reloading=!1)),this.speed.x>0?this.rotation+=.01:this.rotation-=.01,""!==this.asteroid&&(this.asteroid.destroyed?this.asteroid="":(this.asteroid.velocity.x=this.speed.x,this.asteroid.velocity.y=this.speed.y,this.orbitAsteroid(),this.asteroidParticles(1))),this.x+=this.speed.x,this.y+=this.speed.y,Math.random()>.5&&this.createParticles(1);for(var t=0;t<this.particles.length;t++)this.particles[t].update(),this.particles[t].life<=0&&this.particles.splice(t,1)}},{key:"render",value:function(t){t.save(),t.strokeStyle=this.color,t.translate(this.x,this.y),t.rotate(this.rotation),t.beginPath(),t.arc(0,0,this.innerRadius,0,2*Math.PI),t.closePath(),t.stroke(),t.beginPath(),t.arc(0,0,this.radius,0,2*Math.PI),t.closePath(),t.stroke(),this.lineSegments.forEach(function(i){t.beginPath(),t.moveTo(i.xI,i.yI),t.lineTo(i.xF,i.yF),t.stroke()}),t.restore(),this.particles.forEach(function(i){i.render(t)}),this.powerups[3]&&f(d(i.prototype),"drawShield",this).call(this,t)}}]),i}(),M=function(){function t(i,s,h){e(this,t),this.pos={x:i,y:s},this.type=h,this.radius=10,this.color="red",this.timer=0,this.lineSegments=[],this.initTimer(),this.initShape()}return o(t,[{key:"initTimer",value:function(){switch(this.type){case 1:this.timer=900;break;case 2:this.timer=1200;break;case 3:this.timer=3600,this.color="magenta"}}},{key:"initShape",value:function(){switch(this.type){case 1:this.initLineSegments()}}},{key:"initLineSegments",value:function(){for(var t,i,s,e,h=0;h<2;h++){var o=Math.cos(h*Math.PI/2),r=Math.sin(h*Math.PI/2);t=o*this.radius,i=-o*this.radius,s=-r*this.radius,e=r*this.radius,this.lineSegments.push({xI:t,xF:i,yI:s,yF:e})}}},{key:"render",value:function(t){t.save(),t.strokeStyle=this.color,t.translate(this.pos.x,this.pos.y),t.beginPath(),t.arc(0,0,this.radius,0,2*Math.PI),t.closePath(),t.stroke(),t.beginPath(),t.rect(1.3*-this.radius,1.3*-this.radius,2.6*this.radius,2.6*this.radius),t.closePath(),t.stroke(),this.lineSegments.forEach(function(i){t.beginPath(),t.moveTo(i.xI,i.yI),t.lineTo(i.xF,i.yF),t.stroke()}),t.restore()}}]),t}(),w=(s(1),function(){function t(){e(this,t),this.sounds=[],this.over=new Audio("./gameOver.wav"),this.sounds.push(this.over),this.collisionSound=new Audio("collision.wav"),this.collisionSound.volume=.5,this.sounds.push(this.collisionSound),this.explosion=new Audio("./Explosion.wav"),this.explosion.volume=.7,this.sounds.push(this.explosion),this.shipExplosion=new Audio("./shipExplosion.wav"),this.sounds.push(this.shipExplosion),this.ufoLaser=new Audio("./ufoShot.wav"),this.sounds.push(this.ufoLaser),this.teleportSound=new Audio("./teleport.wav"),this.sounds.push(this.teleportSound)}return o(t,[{key:"adjustMasterVolume",value:function(t){this.sounds.forEach(function(i){i.volume+=t,i.volume<0&&(i.volume=0),i.volume>1&&(i.volume=1)})}},{key:"mute",value:function(){this.sounds.forEach(function(t){t.muted=!0})}},{key:"unmute",value:function(){this.sounds.forEach(function(t){t.muted=!1})}},{key:"trigger",value:function(t){switch(t){case"shoot":this.ufoLaser.play();break;case"collision":this.collisionSound.play();break;case"explosion":this.explosion.play();break;case"ship explosion":this.shipExplosion.play();break;case"teleport":this.teleportSound.play();break;case"game over":this.over.play()}}}]),t}()),m=function(){function t(){e(this,t),this.screenSide=1e3,this.MAXUFO=5,this.MAXASTEROIDS=10,this.UFOTIME=500,this.POWERTIME=900,this.numAsteroids=5,this.ship=new a,this.ufos=[],this.kills=0,this.ufoTimer=Math.randomInt(this.UFOTIME,2*this.UFOTIME),this.respawning=!1,this.respawnTimer=300,this.projectiles=[],this.asteroids=[],this.createAsteroids(),this.particles=[],this.score=0,this.highscore=0,this.lives=3,this.level=1,this.constAsteroids=this.level*this.numAsteroids,this.teleports=10,this.coolingDown=50,this.powerups=[],this.powerupTimer=Math.randomInt(this.POWERTIME,3*this.POWERTIME),this.gameOver=!1,this.paused=!1,this.audioController=new w,this.keyMap={13:!1,32:!1,37:!1,38:!1,39:!1,65:!1,68:!1,70:!1,87:!1,88:!1},this.HUDcanvas=document.getElementById("ui"),this.HUDcanvas.width=this.screenSide,this.HUDcanvas.height=100,this.HUDcontext=this.HUDcanvas.getContext("2d"),document.body.appendChild(this.HUDcanvas),this.backBufferCanvas=document.getElementById("canvas"),this.backBufferCanvas.width=this.screenSide,this.backBufferCanvas.height=this.screenSide,this.backBufferContext=this.backBufferCanvas.getContext("2d"),this.screenBufferCanvas=document.getElementById("canvas"),this.screenBufferCanvas.width=this.screenSide,this.screenBufferCanvas.height=this.screenSide,document.body.appendChild(this.screenBufferCanvas),this.screenBufferContext=this.screenBufferCanvas.getContext("2d"),this.loop=this.loop.bind(this),this.handleKeyDown=this.handleKeyDown.bind(this),this.handleKeyUp=this.handleKeyUp.bind(this),window.onkeydown=this.handleKeyDown,window.onkeyup=this.handleKeyUp,this.interval=setInterval(this.loop,50/3)}return o(t,[{key:"masterReset",value:function(){this.ship=new a,this.ufos=[],this.ufoTimer=Math.randomInt(this.UFOTIME,2*this.UFOTIME),this.powerups=[],this.powerupTimer=Math.randomInt(this.POWERTIME,3*this.POWERTIME),this.respawning=!1,this.respawnTimer=300,this.projectiles=[],this.asteroids=[],this.numAsteroids=5,this.createAsteroids(),this.particles=[],this.score=0,this.lives=3,this.level=1,this.constAsteroids=this.level*this.numAsteroids,this.teleports=10,this.coolingDown=50,this.gameOver=!1,this.paused=!1}},{key:"handleKeyDown",value:function(t){t.preventDefault(),this.keyMap[t.keyCode]=!0,80===t.keyCode&&(this.paused?this.paused=!1:this.paused=!0),192===t.keyCode&&this.masterReset()}},{key:"handleKeyUp",value:function(t){t.preventDefault(),this.keyMap[t.keyCode]=!1}},{key:"createProjectile",value:function(){var t=this.ship.x+Math.sin(this.ship.accel.dir)*this.ship.radius*1.2,i=this.ship.y-Math.cos(this.ship.accel.dir)*this.ship.radius*1.2;this.ship.powerups[1]?this.projectiles.push(new x(t,i,this.ship.accel.dir,this.ship.color)):this.projectiles.push(new c(t,i,this.ship.accel.dir,this.ship.color)),this.ship.reloading=!0}},{key:"ufoProjectile",value:function(t,i,s){var e=t.x-i,h=t.y-s,o=Math.sqrt(e*e+h*h),r=Math.acos(h/o);e>0&&(r*=-1);var a=t.x+Math.sin(r)*t.radius*1.2,n=t.y-Math.cos(r)*t.radius*1.2;t.powerups[1]?this.projectiles.push(new x(a,n,r,t.color)):this.projectiles.push(new c(a,n,r,t.color)),this.audioController.trigger("shoot"),t.reloading=!0}},{key:"createAsteroids",value:function(){for(;this.asteroids.length<this.numAsteroids;)this.addAsteroid(-1)}},{key:"addAsteroid",value:function(t){for(var i,s,e,h,o=this.asteroids.length;o===this.asteroids.length;){var r=!1,a=Math.randomInt(1,5);h=Math.randomBetween(10,75),e=h,1===a?(i=Math.randomBetween(-2*e,this.screenSide+2*e),s=-2*e):2===a?(i=this.screenSide+2*e,s=Math.randomBetween(-2*e,this.screenSide+2*e)):3===a?(i=Math.randomBetween(-2*e,this.screenSide+2*e),s=this.screenSide+2*e):(i=-2*e,s=Math.randomBetween(-2*e,this.screenSide+2*e)),this.asteroids.forEach(function(t){Math.circleCollisionDetection(t.x,t.y,t.radius,i,s,e)&&(r=!0)}),r||this.asteroids.push(new n(i,s,h,t))}}},{key:"addUFO",value:function(){for(var t,i,s=this.ufos.length;s===this.ufos.length;){var e=!1,h=Math.randomInt(1,5);1===h?(t=Math.randomBetween(-50,1050),i=-50):2===h?(t=1050,i=Math.randomBetween(-50,1050)):3===h?(t=Math.randomBetween(-50,1050),i=1050):(t=-50,i=Math.randomBetween(-50,1050)),this.asteroids.forEach(function(s){Math.circleCollisionDetection(t,i,65,s.x,s.y,s.radius)&&(e=!0)}),e||this.ufos.push(new g(t,i))}}},{key:"createPowerUp",value:function(){var t=Math.randomInt(.1*this.screenSide,.9*this.screenSide),i=Math.randomInt(.1*this.screenSide,.9*this.screenSide),s=Math.random();s>.66?this.powerups.push(new M(t,i,1)):s>.33?this.powerups.push(new M(t,i,2)):this.powerups.push(new M(t,i,3))}},{key:"rotate",value:function(t,i){return{x:t.x*Math.cos(i)-t.y*Math.sin(i),y:t.x*Math.sin(i)+t.y*Math.cos(i)}}},{key:"particleCollision",value:function(t,i){var s=t.velocity.x-i.velocity.x,e=t.velocity.y-i.velocity.y;if(s*(i.x-t.x)+e*(i.y-t.y)>=0){var h=-Math.atan2(i.y-t.y,i.x-t.x),o=t.mass,r=i.mass,a=this.rotate(t.velocity,h),n=this.rotate(i.velocity,h),c={x:(a.x*(o-r)+2*r*n.x)/(o+r),y:a.y},l={x:(n.x*(r-o)+2*o*a.x)/(o+r),y:n.y},u=this.rotate(c,-h),p=this.rotate(l,-h);t.velocity.x=u.x,t.velocity.y=u.y,i.velocity.x=p.x,i.velocity.y=p.y}}},{key:"projectileDodger",value:function(t,i){var s=Math.getDistance(t.x,t.y,i.x,i.y);if(s<2*t.bufferRadius+i.radius){var e=Math.getDirection(i.x,i.y,t.x,t.y);t.alterPath(e),t.setClock(),t.clock--}return s<t.radius+i.radius}},{key:"handleAsteriodExplosion",value:function(t){var i=this.asteroids[t],s=i.mass,e=i.x,h=i.y;if(i.destroyed=!0,this.asteroids.splice(t,1),this.audioController.trigger("explosion"),this.score+=Math.floor(100/s),s>=15){var o=Math.randomInt(2,4);this.numAsteroids+=o-1,s/=o;for(var r=Math.randomBetween(0,2*Math.PI),a=2*Math.PI/o,c=0;c<o;c++){var l=e+Math.cos(r)*s,u=h-Math.sin(r)*s;this.asteroids.push(new n(l,u,s,r)),r+=a}}else this.numAsteroids--}},{key:"detectShipCrash",value:function(t,i){var s=t.x-i.x,e=t.y-i.y,h=s*s+e*e;if(h<Math.pow(i.radius+t.radius,2))return!0;if(t.asteroid!==i){if(h<Math.pow(t.bufferRadius+i.radius,2)){var o=Math.getDirection(i.x,i.y,t.x,t.y);t.alterPath(o),("blue"===t.color||"fuchsia"===t.color)&&i.radius<t.critical&&""===t.asteroid?t.catchAsteroid(i):h<Math.pow(t.critical+i.radius,2)&&(t.reloading||this.ufoProjectile(t,i.x,i.y))}return!1}}},{key:"explode",value:function(t,i,s){for(var e=Math.randomInt(30,70),h=Math.randomBetween(0,2*Math.PI),o=Math.randomInt(3,5),a=Math.randomInt(30,40),n=0;n<e;n++)Math.random()>.6&&(h=Math.randomBetween(0,2*Math.PI)),this.particles.push(new r(t,i,Math.PI*h,o,s,a))}},{key:"teleport",value:function(){var t=this,i=Math.randomBetween(100,900),s=Math.randomBetween(100,900),e=!1;do{e&&(i=Math.randomBetween(100,900),s=Math.randomBetween(100,900),e=!1),this.ufos.forEach(function(h){Math.circleCollisionDetection(i,s,t.ship.radius,h.x,h.y,h.radius+100)&&(e=!0)}),this.asteroids.forEach(function(h){Math.circleCollisionDetection(i,s,t.ship.radius,h.x,h.y,h.radius+50)&&(e=!0)}),this.projectiles.forEach(function(h){Math.circleCollisionDetection(h.x,h.y,h.radius,i,s,t.ship.radius+50)&&(e=!0)})}while(e);this.explode(this.ship.x,this.ship.y,this.ship.color),this.explode(i,s,this.ship.color),this.audioController.trigger("teleport"),this.ship.x=i,this.ship.y=s,this.ship.speed.x=0,this.ship.speed.y=0}},{key:"respawn",value:function(){this.respawning=!0,this.lives--,this.lives>=0?this.ship=new a:(this.gameOver=!0,this.audioController.trigger("game over"))}},{key:"destoryUFO",value:function(t){this.score+=this.ufos[t].bounty,200!==this.ufos[t].bounty&&500!==this.ufos[t].bounty||this.lives++,this.kills++,this.ufos.splice(t,1),this.audioController.trigger("ship explosion")}},{key:"checkHighScore",value:function(){this.score>this.highscore&&(this.highscore=this.score)}},{key:"drawHUD",value:function(){this.HUDcontext.fillStyle="black",this.HUDcontext.strokeStyle="blue",this.HUDcontext.fillRect(0,0,this.screenSide,100),this.HUDcontext.font="30px Times New Roman",this.HUDcontext.strokeText("LIVES: "+this.lives,10,50),this.HUDcontext.strokeText("LEVEL: "+this.level,400,50),this.HUDcontext.strokeText("SCORE: "+this.score,800,50),this.HUDcontext.strokeText("TELEPORTS: "+this.teleports,550,50),this.HUDcontext.strokeText("HIGHSCORE: "+this.highscore,150,50),this.HUDcontext.font="20px Times New Roman",this.HUDcontext.strokeText("CONTROLS: ",10,75),this.HUDcontext.strokeText("W: Thurster  A: Rotate Left  D: Rotate Right  Space: Shoot  F: Teleport  P: Pause  ~: Reset",150,75)}},{key:"update",value:function(){var t=this;if(this.ship.update(),this.ufos.forEach(function(i){if(("orange"===i.color||"fuchsia"===i.color)&&""===i.goal&&t.powerups.length>0){var s=Math.randomInt(0,t.powerups.length-1);i.goal={x:t.powerups[s].pos.x,y:t.powerups[s].pos.y}}i.update(),""===i.asteroid||t.respawning||i.checkAsteroidAlignment(t.ship)}),this.asteroids.length<this.constAsteroids&&(this.addAsteroid(-1),this.numAsteroids++),this.asteroids.forEach(function(t){t.update()}),0!==this.kills&&this.kills%(5*this.level)===0){this.level++,this.lives++,this.teleports+=this.level;var i=5+this.level;i>this.MAXASTEROIDS&&(i=this.MAXASTEROIDS);var s=i-this.asteroids.length;if(this.asteroids.length<i)for(var e=0;e<s;e++)this.addAsteroid(-1),this.numAsteroids++;this.constAsteroids=this.numAsteroids}this.ufoTimer>0&&this.ufos.length<this.MAXUFO&&(this.ufoTimer--,this.ufoTimer<=0&&(this.addUFO(),this.ufoTimer=Math.randomInt(this.UFOTIME*(this.ufos.length/this.level),2*this.UFOTIME*(this.ufos.length/this.level)))),this.powerupTimer--,this.powerupTimer<=0&&(this.createPowerUp(),this.powerupTimer=Math.randomInt(this.POWERTIME*this.powerups.length,3*this.POWERTIME*this.powerups.length)),this.respawning&&(this.respawnTimer--,this.respawnTimer<=0&&(this.respawnTimer=300,this.respawning=!1));for(var h=0;h<this.asteroids.length;h++)for(var o=h+1;o<this.asteroids.length;o++)Math.circleCollisionDetection(this.asteroids[h].x,this.asteroids[h].y,this.asteroids[h].radius,this.asteroids[o].x,this.asteroids[o].y,this.asteroids[o].radius)&&(this.particleCollision(this.asteroids[h],this.asteroids[o]),this.audioController.trigger("collision"));for(var r=0;r<this.projectiles.length;r++)for(var a=0;a<this.asteroids.length;a++)if(Math.circleCollisionDetection(this.projectiles[r].x,this.projectiles[r].y,this.projectiles[r].radius,this.asteroids[a].x,this.asteroids[a].y,this.asteroids[a].radius)){this.explode(this.projectiles[r].x,this.projectiles[r].y,this.projectiles[r].color),this.projectiles.splice(r,1),this.explode(this.asteroids[a].x,this.asteroids[a].y,"white"),this.handleAsteriodExplosion(a);break}this.respawning||this.asteroids.forEach(function(i){Math.circleCollisionDetection(t.ship.x,t.ship.y,t.ship.radius,i.x,i.y,i.radius)&&(t.explode(t.ship.x,t.ship.y,t.ship.color),t.audioController.trigger("ship explosion"),t.respawn())});for(var n=0;n<this.powerups.length;n++){if(Math.circleCollisionDetection(this.ship.x,this.ship.y,this.ship.radius,this.powerups[n].pos.x,this.powerups[n].pos.y,this.powerups[n].radius)){this.explode(this.ship.x,this.ship.y,this.ship.color),this.ship.powerups[this.powerups[n].type]=!0,this.ship.powerupTimers[this.powerups[n].type]+=this.powerups[n].timer,2===this.powerups[n].type&&(this.ship.reloading=!1,this.ship.rateOfFire=this.ship.RATE/2),this.powerups.splice(n,1);break}for(var c=0;c<this.ufos.length;c++)if(Math.circleCollisionDetection(this.ufos[c].x,this.ufos[c].y,this.ufos[c].radius,this.powerups[n].pos.x,this.powerups[n].pos.y,this.powerups[n].radius)){this.explode(this.ufos[c].x,this.ufos[c].y,this.ufos[c].color),this.ufos[c].powerups[this.powerups[n].type]=!0,this.ufos[c].powerupTimers[this.powerups[n].type]+=this.powerups[n].timer,2===this.powerups[n].type&&(this.ufos[c].reloading=!1,this.ufos[c].setRateOfFire()),this.powerups.splice(n,1);break}}for(var l=0;l<this.powerups.length;l++)for(var u=0;u<this.asteroids.length;u++)if(Math.circleCollisionDetection(this.asteroids[u].x,this.asteroids[u].y,this.asteroids[u].radius,this.powerups[l].pos.x,this.powerups[l].pos.y,this.powerups[l].radius)){this.explode(this.powerups[l].pos.x,this.powerups[l].pos.y,this.powerups[l].color),this.powerups.splice(l,1);break}for(var p=0;p<this.ufos.length;p++)for(var d=0;d<this.asteroids.length;d++)if(this.detectShipCrash(this.ufos[p],this.asteroids[d])){this.explode(this.ufos[p].x,this.ufos[p].y,this.ufos[p].color),this.destoryUFO(p);break}if(this.ufos.length>1)for(var f=0;f<this.ufos.length;f++)for(var y=f+1;y<this.ufos.length;y++)if(Math.circleCollisionDetection(this.ufos[f].x,this.ufos[f].y,this.ufos[f].critical,this.ufos[y].x,this.ufos[y].y,this.ufos[y].critical)){"purple"!==this.ufos[f].color&&"fuchsia"!==this.ufos[f].color||this.ufos[f].reloading||this.ufoProjectile(this.ufos[f],this.ufos[y].x,this.ufos[y].y),"purple"!==this.ufos[y].color&&"fuchsia"!==this.ufos[f].color||this.ufos[f].reloading||this.ufoProjectile(this.ufos[y],this.ufos[f].x,this.ufos[f].y);var v=Math.getDirection(this.ufos[f].x,this.ufos[f].y,this.ufos[y].x,this.ufos[y].y);this.ufos[f].alterPath(v+Math.PI),this.ufos[y].alterPath(v)}this.respawning||this.ufos.forEach(function(i){Math.circleCollisionDetection(t.ship.x,t.ship.y,t.ship.radius,i.x,i.y,i.radius)&&(t.explode(t.ship.x,t.ship.y,t.ship.color),t.audioController.trigger("ship explosion"),t.respawn())});for(var x=0;x<this.projectiles.length;x++){if(!this.respawning&&Math.circleCollisionDetection(this.projectiles[x].x,this.projectiles[x].y,this.projectiles[x].radius,this.ship.x,this.ship.y,this.ship.radius)){this.ship.powerups[3]?(this.explode(this.ship.x,this.ship.y,"magenta"),this.ship.powerups[3]=!1,this.ship.powerupTimers[3]=0):(this.explode(this.ship.x,this.ship.y,this.ship.color),this.audioController.trigger("ship explosion"),this.respawn()),this.explode(this.projectiles[x].x,this.projectiles[x].y,this.projectiles[x].color),this.projectiles.splice(x,1);break}for(var g=0;g<this.ufos.length;g++)if("purple"!==this.ufos[g].color&&"fuchsia"!==this.ufos[g].color||this.ufos[g].clock!==this.ufos[g].CLOCK){if(Math.circleCollisionDetection(this.projectiles[x].x,this.projectiles[x].y,this.projectiles[x].radius,this.ufos[g].x,this.ufos[g].y,this.ufos[g].radius)){this.ufos[g].powerups[3]?(this.explode(this.ufos[g].x,this.ufos[g].y,"magenta"),this.ufos[g].powerups[3]=!1,this.ufos[g].powerupTimers[3]=0):(this.explode(this.ufos[g].x,this.ufos[g].y,this.ufos[g].color),this.destoryUFO(g),this.audioController.trigger("ship explosion")),this.explode(this.projectiles[x].x,this.projectiles[x].y,this.projectiles[x].color),this.projectiles.splice(x,1);break}}else if(this.projectileDodger(this.ufos[g],this.projectiles[x])){this.ufos[g].powerups[3]?(this.explode(this.ufos[g].x,this.ufos[g].y,"magenta"),this.ufos[g].powerups[3]=!1,this.ufos[g].powerupTimers[3]=0):(this.explode(this.ufos[g].x,this.ufos[g].y,this.ufos[g].color),this.destoryUFO(g),this.audioController.trigger("ship explosion")),this.explode(this.projectiles[x].x,this.projectiles[x].y,this.projectiles[x].color),this.projectiles.splice(x,1);break}}if((this.keyMap[65]||this.keyMap[37])&&(this.ship.accel.dir-=.07,this.ship.accel.dir<=2*-Math.PI&&(this.ship.accel.dir+=2*Math.PI)),(this.keyMap[68]||this.keyMap[39])&&(this.ship.accel.dir+=.07,this.ship.accel.dir>=2*Math.PI&&(this.ship.accel.dir-=2*Math.PI)),this.respawnTimer<=150||!this.respawning)if(this.ship.boosting=!1,this.keyMap[13]&&this.ship.boost>=0){this.ship.boosting=!0,this.ship.boost--,this.ship.updateSpeed(3*this.ship.accel.mag);var M=Math.floor(Math.randomBetween(4,8));this.ship.createParticles(M)}else if(this.keyMap[87]||this.keyMap[38]){this.ship.updateSpeed(this.ship.accel.mag);var w=Math.floor(Math.randomBetween(1,4));this.ship.createParticles(w)}if(!this.keyMap[32]||this.ship.reloading||this.respawning||(this.createProjectile(),this.audioController.trigger("shoot")),this.keyMap[70]&&this.teleports>0&&!this.respawning&&50===this.coolingDown&&(this.teleport(),this.teleports--,this.coolingDown--),this.respawning)for(var m=0;m<this.ufos.length;m++){var k=this.ufos[m];k.rateOfFire--,k.rateOfFire<=0&&(this.ufoProjectile(k,this.ship.x,this.ship.y),k.setRateOfFire())}this.coolingDown<50&&(this.coolingDown--,this.coolingDown<=0&&(this.coolingDown=50));for(var b=0;b<this.projectiles.length;b++)"green"===this.projectiles[b].color?this.projectiles[b].update(this.ufos):this.projectiles[b].update(this.ship),this.projectiles[b].edgeDetection()&&this.projectiles.splice(b,1);for(var P=0;P<this.particles.length;P++)this.particles[P].update(),this.particles[P].life<=0&&this.particles.splice(P,1);this.checkHighScore()}},{key:"render",value:function(){var t=this;this.backBufferContext.fillStyle="black",this.backBufferContext.strokeStyle="blue",this.backBufferContext.font="50px Times New Roman",this.backBufferContext.fillRect(0,0,this.screenSide,this.screenSide),this.drawHUD(),this.respawning&&!this.gameOver&&(this.backBufferContext.save(),this.backBufferContext.globalAlpha=.5,this.backBufferContext.strokeText("RESPAWNING",350,500),this.backBufferContext.restore()),this.ufos.forEach(function(i){i.render(t.backBufferContext)}),(!this.respawning||this.respawnTimer<=150)&&this.ship.render(this.backBufferContext),this.asteroids.forEach(function(i){i.render(t.backBufferContext)}),this.projectiles.forEach(function(i){i.render(t.backBufferContext)}),this.powerups.forEach(function(i){i.render(t.backBufferContext)}),this.particles.forEach(function(i){i.render(t.backBufferContext)}),this.screenBufferContext.drawImage(this.backBufferCanvas,0,0)}},{key:"loop",value:function(){this.paused||this.gameOver||(this.update(),this.render()),this.gameOver&&(this.screenBufferContext.font="50px Times New Roman",this.screenBufferContext.strokeText("GAME OVER",350,500),this.screenBufferContext.strokeText("Retry? Press ~",360,600)),this.paused&&(this.screenBufferContext.font="50px Times New Roman",this.screenBufferContext.strokeText("Paused",425,600))}}]),t}();s(2);s.d(i,"default",function(){return k});var k=function(){function t(){e(this,t),this.screenWidth=1e3,this.gameState="menu",this.highlighted="start",this.buttons=["start","options"],window.onmousedown=this.handleMouseDown,window.onkeydown=this.handleKeyDown}return o(t,[{key:"handleKeyDown",value:function(t){t.preventDefualt(),this.gameState}}]),t}();new m}],[[0,1]]]);
//# sourceMappingURL=main.08e27e37.chunk.js.map