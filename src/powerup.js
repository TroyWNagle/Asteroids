
/** @Class PowerUp
	*	Object to keep track of power up information.
	*/
export default class PowerUp {
	/** @Constructor
		* Handles the initialization of a power up object.
		* @param {floats} x, y - position variables
		* @param {int} type - type theh power up needs to be, can only be 1 = Homing, 2 = Rapid Fire, 3 = Shield
		*/
	constructor(x, y, type) {
		this.pos = {x: x, y: y};
		this.type = type
		this.radius = 10;
		this.color = '';
		this.timer = 0;
		//Detemines the shape of the power up
		this.lineSegments = []
		this.initPowerUp();
	}

	/** @Function initPowerUp
		* Handles the initialization of the power ups' specific variables.
		*/
	initPowerUp() {
		switch (this.type){
				//Homing
				case 1:
					//16.6 seconds at 60 fps
					this.timer = 1000;
					this.color = 'red';
					this.initLineSegments();
					break;
				//Rapid Fire
				case 2:
					//20 seconds at 60 fps
					this.timer = 1200;
					this.color = 'green';
					this.initRapidLineSegments();
					break;
				//Shield
				case 3:
					//45 seconds at 60 fps
					this.timer = 2700;
					this.color = 'magenta';
					break;
			default:
		}
	}

	/** @Function initRapidLineSegments()
		* Handles the filling of the line Segments array for the shape of the rapid fire power up.
		*/
	initRapidLineSegments() {
		let xi, xf, yi, yf;
		let angle1 = 3 * Math.PI / 4;
		let angle2 = Math.PI / 3;
		let angle3 = 4 * Math.PI / 3;
		xi = -Math.cos(angle1) * this.radius * 0.8;
		xf = Math.cos(angle1) * this.radius * 0.8;
		yi = -Math.sin(angle1) * this.radius * 0.8;
		yf = Math.sin(angle1) * this.radius * 0.8;
		this.lineSegments.push({xI: xi, xF: xf, yI: yi, yF: yf});
		xi = -Math.cos(angle2) * this.radius * 0.9;
		xf = Math.cos(angle1) * this.radius * 0.7;
		yi = -Math.sin(angle2) * this.radius * 0.9;
		yf = Math.sin(angle1) * this.radius * 0.7;
		this.lineSegments.push({xI: xi, xF: xf, yI: yi, yF: yf});
		xi = -Math.cos(angle3) * this.radius * 0.9;
		xf = Math.cos(angle1) * this.radius * 0.7;
		yi = -Math.sin(angle3) * this.radius * 0.9;
		yf = Math.sin(angle1) * this.radius * 0.7;
		this.lineSegments.push({xI: xi, xF: xf, yI: yi, yF: yf});
	}

	/** @Function initLineSegments()
		* Handles theh initialization of theh line segments array for the homing projectile.
		*/
	initLineSegments() {
		let xi;
		let xf;
		let yi;
		let yf;
		let numSegments = 2;
		for(let i = 0; i < numSegments; i++) {
			//Calculate various sin and cos values
			let cos = Math.cos(i * Math.PI / 2);
			let sin = Math.sin(i * Math.PI / 2);
			//Set x values based on cos * radius values
			xi = cos * this.radius;
			xf = -cos * this.radius;
			//Set y values based on - sin * radius values
			yi = -sin * this.radius;
			yf = sin * this.radius;
			this.lineSegments.push({xI: xi, xF: xf, yI: yi, yF: yf});
		}
	}

/** @function render()
 * standard render function
 */
 render(ctx) {
   ctx.save();
   ctx.strokeStyle = this.color;
   ctx.translate(this.pos.x, this.pos.y);
   ctx.beginPath();
   ctx.arc(0, 0, this.radius, 0, Math.tau);
   ctx.closePath();
   ctx.stroke();
	 ctx.beginPath();
	 ctx.rect(-this.radius * 1.30, -this.radius * 1.30, this.radius * 2.60, this.radius * 2.60)
	 ctx.closePath();
	 ctx.stroke();
   this.lineSegments.forEach(segment => {
     ctx.beginPath();
     ctx.moveTo(segment.xI, segment.yI);
     ctx.lineTo(segment.xF, segment.yF);
     ctx.stroke();
   });
   ctx.restore();
 }
}
