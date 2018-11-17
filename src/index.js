import Game from './game.js';
import './game.css';

export default class Menu {
	constructor() {
		this.screenWidth = 1000;
		this.gameState = 'main menu';
		this.highlighted = 0;
		this.buttons = ['start', 'options', 'controls'];

		//Back Buffer
		this.backBufferCanvas = document.getElementById("canvas");
		this.backBufferCanvas.width = this.screenWidth;
		this.backBufferCanvas.height = this.screenWidth;
		this.backBufferContext = this.backBufferCanvas.getContext('2d');

		//Canvas that actually gets put on the screen
		this.screenBufferCanvas = document.getElementById("canvas");
		this.screenBufferCanvas.width = this.screenWidth;
		this.screenBufferCanvas.height = this.screenWidth;
		document.body.appendChild(this.screenBufferCanvas);
		this.screenBufferContext = this.screenBufferCanvas.getContext('2d');

		this.render = this.render.bind(this);
		this.handleKeyDown = this.handleKeyDown.bind(this);
		window.onmousedown = this.handleMouseDown;
		window.onkeydown = this.handleKeyDown;

		this.interval = setInterval(this.render, 50 / 3);
	}

	handleKeyDown(event){
		event.preventDefault();
		//console.log(event.keyCode);
		if(this.gameState === 'main menu') {
			//Enter
			if(event.keyCode === 13) {
				this.clickButton(this.buttons[this.highlighted]);
			}
			//W & Up arrow
			if(event.keyCode === 87 || event.keyCode === 38) {
				this.highlighted--;
				if(this.highlighted < 0) {
					this.highlighted = this.buttons.length - 1;
				}
			}
			//S & Down Arrow
			if(event.keyCode === 83 || event.keyCode === 40) {
				this.highlighted++;
				if(this.highlighted >= this.buttons.length) {
					this.highlighted = 0;
				}
			}
		}
		else if(this.gameState === 'controls') {
			this.gameState = 'main menu';
		}
	}

	clickButton(button) {
		switch (button) {
			case "start":
				new Game(this.backBufferContext, this.backBufferCanvas, this.screenBufferContext, this.screenWidth);
				this.gameState = "game";
				break;
			case "controls":
				this.gameState = "controls";
				break;
			default:

		}
	}

	drawMenu() {
		//Initial Setup
		this.backBufferContext.fillStyle = 'black';
		this.backBufferContext.font = '50px Arial';
		//Refresh canvas
		this.backBufferContext.fillRect(0,0, this.screenWidth, this.screenWidth);

		this.backBufferContext.save();
		this.backBufferContext.fillStyle = "blue";
		let scaleY = 0.30;
		for(let i = 0; i < this.buttons.length; i++) {
			if(this.highlighted === i) {
				this.backBufferContext.strokeStyle = "cyan";
			}
			else {
				this.backBufferContext.strokeStyle = "blue";
			}
			this.backBufferContext.strokeRect(this.screenWidth * 0.35, this.screenWidth * scaleY, this.screenWidth * 0.3, this.screenWidth * 0.1);
			scaleY += 0.15;
		}

		this.backBufferContext.fillText("Start", this.screenWidth * 0.44, this.screenWidth * 0.37);
		this.backBufferContext.fillText("Options", this.screenWidth * 0.42, this.screenWidth * 0.52);
		this.backBufferContext.fillText("Controls", this.screenWidth * 0.41, this.screenWidth * 0.67);
		this.backBufferContext.restore();

		this.screenBufferContext.drawImage(this.backBufferCanvas, 0, 0);
	}

	drawControls() {
		//Initial Setup
		this.backBufferContext.fillStyle = 'black';
		this.backBufferContext.font = '50px Arial';
		//Refresh canvas
		this.backBufferContext.fillRect(0,0, this.screenWidth, this.screenWidth);
		this.backBufferContext.save();
		this.backBufferContext.fillStyle = "blue";
		this.backBufferContext.fillText("W or Up Arrow: Thruster", this.screenWidth * 0.20, this.screenWidth * 0.25);
		this.backBufferContext.fillText("A or Left Arrow: Rotate Left", this.screenWidth * 0.17, this.screenWidth * 0.35);
		this.backBufferContext.fillText("D or Right Arrow: Rotate Right", this.screenWidth * 0.15, this.screenWidth * 0.45);
		this.backBufferContext.fillText("Spacebar: Shoot", this.screenWidth * 0.29, this.screenWidth * 0.55);
		this.backBufferContext.fillText("Enter: Boost", this.screenWidth * 0.34, this.screenWidth * 0.65);
		this.backBufferContext.fillText("F: Teleport", this.screenWidth * 0.36, this.screenWidth * 0.75);
		this.backBufferContext.fillText("Any Key to Go Back", this.screenWidth * 0.26, this.screenWidth * 0.90);
		this.backBufferContext.restore();
		this.screenBufferContext.drawImage(this.backBufferCanvas, 0, 0);
	}

	render() {
		if(this.gameState === "main menu") {
			this.drawMenu();
		}
		else if(this.gameState === "controls") {
			this.drawControls();
		}
	}
}

new Menu();
//new Game();
