

export default class PowerUp {
	constructor(x, y, type) {
		this.pos = {x: x, y: y};
		this.type = type
		this.radius = 10;
		this.color = '';
		this.timer = 0;
		this.lineSegments = []
		this.initTimer()
		this.initShape()
	}

	initTimer() {
		switch (this.type){
				//Homing
				case 1:
					//16.6 seconds at 60 fps
					this.timer = 1000;
					this.color = 'red';
					break;
				//Rapid Fire
				case 2:
					//20 seconds at 60 fps
					this.timer = 1200;
					this.color = 'green';
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

	initShape() {
		switch (this.type) {
			case 1:
				this.initLineSegments()
				break;
			case 2:
				this.initRapidLineSegments();
				break;
			default:

		}
	}

	initRapidLineSegments() {
		let xi, xf, yi, yf;
		xi = -Math.cos(3 * Math.PI / 4) * this.radius * 0.8;
		xf = Math.cos(3 * Math.PI / 4) * this.radius * 0.8;
		yi = -Math.sin(3 * Math.PI / 4) * this.radius * 0.8;
		yf = Math.sin(3 * Math.PI / 4) * this.radius * 0.8;
		this.lineSegments.push({xI: xi, xF: xf, yI: yi, yF: yf});
		xi = -Math.cos(Math.PI / 3) * this.radius * 0.9;
		xf = Math.cos(3 * Math.PI / 4) * this.radius * 0.7;
		yi = -Math.sin(Math.PI / 3) * this.radius * 0.9;
		yf = Math.sin(3 * Math.PI / 4) * this.radius * 0.7;
		this.lineSegments.push({xI: xi, xF: xf, yI: yi, yF: yf});
		xi = -Math.cos(4 * Math.PI / 3) * this.radius * 0.9;
		xf = Math.cos(3 * Math.PI / 4) * this.radius * 0.7;
		yi = -Math.sin(4 * Math.PI / 3) * this.radius * 0.9;
		yf = Math.sin(3 * Math.PI / 4) * this.radius * 0.7;
		this.lineSegments.push({xI: xi, xF: xf, yI: yi, yF: yf});
	}

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
