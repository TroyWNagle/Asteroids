import Game from './game.js';
import './game.css';
import AudioController from './audiocontroller.js';

/** @Class Menu
	* Object to control the menus & managing game state
	*/
export default class Menu {
	/** @Constructor
		* Initializes all essential variables for the menus & rendering
		*/
	constructor() {
		this.screenWidth = 1000;
		//State variable that changes how user input handling happens
		this.gameState = 'main menu';
		//Game variable that will be turned into a Game Object
		this.game = null;
		//Index variable for the array of buttons
		this.highlighted = 0;
		//Array of button information such as location and size.
		this.buttons = [];
		this.buttonNames = ['start', 'mute', 'controls'];
		//Variable to control when menu music should start, to avoid auto-play erros from Google Chrome
		this.musicStarted = false;
		//Keeps track of whether or not sounds are muted.
		this.muted = false;
		this.initButtons();
		this.audioController = new AudioController();

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

		//Binders
		this.render = this.render.bind(this);
		this.handleKeyDown = this.handleKeyDown.bind(this);
		this.handleMouseDown = this.handleMouseDown.bind(this);
		window.onmousedown = this.handleMouseDown;
		window.onkeydown = this.handleKeyDown;

		//Sets loop for menu, 60 fps
		this.interval = setInterval(this.render, 50 / 3);
	}

	/** @Function initButtons()
		* Handles the initialization of button information
		*/
	initButtons() {
		let scaleY = 0.30;
		for(let i = 0; i < 3; i++) {
			this.buttons.push({x: this.screenWidth * 0.35, y: this.screenWidth * scaleY, width: this.screenWidth * 0.3, height: this.screenWidth * 0.1})
			scaleY += 0.15;
		}
	}

	/** @Function handleKeyDown()
		* Event handler function for user input.
		* @param {event} event - event object
		*/
	handleKeyDown(event){
		event.preventDefault();
		//Allow menu music to start playing if it hasn't already
		if(!this.musicStarted) {
			this.audioController.playMenu();
			this.musicStarted = true;
		}
		//Check game state
		if(this.gameState === 'main menu') {
			//Enter
			if(event.keyCode === 13) {
				//Activate button that is highlighted
				this.clickButton(this.buttonNames[this.highlighted]);
			}
			//W & Up arrow
			if(event.keyCode === 87 || event.keyCode === 38) {
				//Alter highlighted button
				this.highlighted--;
				if(this.highlighted < 0) {
					this.highlighted = this.buttons.length - 1;
				}
			}
			//S & Down Arrow
			if(event.keyCode === 83 || event.keyCode === 40) {
				//Alter highlighted button
				this.highlighted++;
				if(this.highlighted >= this.buttons.length) {
					this.highlighted = 0;
				}
			}
		}
		//If you are in the controls screen, just go back to the main menu.
		else if(this.gameState === 'controls') {
			this.gameState = 'main menu';
		}
	}

	/** @Function handleMouseDown()
		* Event handler function for user input
		* @param {event} event - event object
		*/
	handleMouseDown(event) {
		event.preventDefault();
		//Allow menu musice to start if it hasn't yet.
		if(!this.musicStarted) {
			this.audioController.playMenu();
			this.musicStarted = true;
		}
		//Adjust the client click position to the canvas position. Drawing with 1000px / 800px canvas (1000 / 800) = 5 / 4
		let x = event.clientX * 5 / 4;
		let y = event.clientY * 5 / 4;
		//Check game state
		if(this.gameState === 'main menu' || this.gameState === 'paused') {
			//Check if a button was clicked
			for(let i = 0; i < this.buttons.length; i++) {
				let check = Math.circleRectangleCollision(x, y, 10, this.buttons[i].x, this.buttons[i].y, this.buttons[i].width, this.buttons[i].height);
				if(check) {
					//Activate the button that was clicked.
					this.clickButton(this.buttonNames[i]);
				}
			}
		}
		//If in controls screen go back to menu.
		else if(this.gameState === 'controls') {
			this.gameState = 'main menu';
		}
		else if(this.gameState === 'gameOver') {
			//Check if buttons have been clicked
			for(let i = 1; i < this.buttons.length; i++) {
				let check = Math.circleRectangleCollision(x, y, 10, this.buttons[i].x, this.buttons[i].y, this.buttons[i].width, this.buttons[i].height);
				if(check) {
					this.clickButton(this.buttonNames[i]);
				}
			}
		}
	}

	/** @Function clickButton()
		* Activates the appropriate behavior
		* @param {string} button - name of the button pressed.
		*/
	clickButton(button) {
		switch (button) {
			case "start":
			case "restart":
			case 0:
				//Check it there is already a game object or not.
				if(this.game !== null) {
					this.audioController.stopTheme();
					if(!this.muted) {
						this.audioController.pickTheme();
					}
					//Reset the game object
					this.game.masterReset();
					this.gameState = "game";
					this.audioController.stopMenu();
					this.audioController.playTheme();
				}
				else {
					//If there isn't a game object, create one.
					this.game = new Game(this);
					this.gameState = "game";
					this.audioController.playTheme();
					this.audioController.stopMenu();
				}
				// Stop the menu interval
				clearInterval(this.interval);
				break;
			case "mute":
			case 1:
			//Check whether the sound is muted already or n
				if(this.muted) {
					this.audioController.unmute();
					this.muted = false;
				}
				else {
					this.audioController.mute();
					this.muted = true;
				}
				break;
			case "controls":
			case 2:
					this.gameState = "controls";
				break;
			case "resume":
				this.gameState = "game";
				this.game.paused = false;
				break;
			default:

		}
	}

	/** @Function drawMenu()
		* Draws the buttons of the main menu
		*/
	drawMenu() {
		this.backBufferContext.save();
		this.backBufferContext.fillStyle = "blue";
		for(let i = 0; i < this.buttons.length; i++) {
			//Make sure the highlighted button is a brighter color
			if(this.highlighted === i) {
				this.backBufferContext.strokeStyle = "cyan";
			}
			else {
				this.backBufferContext.strokeStyle = "blue";
			}
			this.backBufferContext.strokeRect(this.buttons[i].x, this.buttons[i].y, this.buttons[i].width, this.buttons[i].height);
		}

		this.backBufferContext.fillText("Start", this.screenWidth * 0.44, this.screenWidth * 0.37);
		this.backBufferContext.fillText("Mute", this.screenWidth * 0.44, this.screenWidth * 0.52);
		this.backBufferContext.fillText("Controls", this.screenWidth * 0.41, this.screenWidth * 0.67);
		this.backBufferContext.fillText("By: Troy Nagle", this.screenWidth * 0.02, this.screenWidth * 0.98);
		this.backBufferContext.font = '120px Times New Roman';
		this.backBufferContext.fillText("Asteroids", this.screenWidth * 0.05, this.screenWidth * 0.25);
		this.backBufferContext.fillText(" & ", this.screenWidth * 0.50, this.screenWidth * 0.25);
		this.backBufferContext.fillText("Aliens", this.screenWidth * 0.65, this.screenWidth * 0.25);
		this.backBufferContext.restore();

		this.screenBufferContext.drawImage(this.backBufferCanvas, 0, 0);
	}

	/** @Function drawControls()
		* Draws the controls screen
		*/
	drawControls() {
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

	/** @Function drawPauseMenu()
		* Draws the buttons of the pause menu.
		*/
	drawPauseMenu() {
		this.backBufferContext.save();
		this.backBufferContext.fillStyle = "black";
		this.backBufferContext.strokeStyle = "blue";
		for(let i = 0; i < this.buttons.length; i++) {
			this.backBufferContext.fillRect(this.buttons[i].x, this.buttons[i].y, this.buttons[i].width, this.buttons[i].height);
			this.backBufferContext.strokeRect(this.buttons[i].x, this.buttons[i].y, this.buttons[i].width, this.buttons[i].height);
		}
		this.backBufferContext.fillStyle = "blue";
		this.backBufferContext.fillText("Resume", this.screenWidth * 0.42, this.screenWidth * 0.37);
		this.backBufferContext.fillText("Restart", this.screenWidth * 0.43, this.screenWidth * 0.52);
		this.backBufferContext.fillText("Mute", this.screenWidth * 0.44, this.screenWidth * 0.67);
		this.backBufferContext.restore();
		this.screenBufferContext.drawImage(this.backBufferCanvas, 0, 0);
	}

	/** @Function drawGameOver()
		* Draws the game over screen & buttons
		*/
	drawGameOver() {
		this.backBufferContext.save();
		this.backBufferContext.fillStyle = "black";
		this.backBufferContext.strokeStyle = "blue";
		for(let i = 1; i < this.buttons.length; i++) {
			this.backBufferContext.fillRect(this.buttons[i].x, this.buttons[i].y, this.buttons[i].width, this.buttons[i].height);
			this.backBufferContext.strokeRect(this.buttons[i].x, this.buttons[i].y, this.buttons[i].width, this.buttons[i].height);
		}
		this.backBufferContext.fillStyle = "blue";
		this.backBufferContext.font = '100px Times New Roman';
		this.backBufferContext.fillText("Game Over", this.screenWidth * 0.30, this.screenWidth * 0.30);
		this.backBufferContext.font = '50px Arial';
		this.backBufferContext.fillText("Restart", this.screenWidth * 0.43, this.screenWidth * 0.52);
		this.backBufferContext.fillText("Mute", this.screenWidth * 0.44, this.screenWidth * 0.67);
		this.backBufferContext.restore();
		this.screenBufferContext.drawImage(this.backBufferCanvas, 0, 0);
	}

	/** @Function render()
		* Refreshes the screen & calls certain draw functions depending on the game state.
		*/
	render() {
		//Initial Setup
		this.backBufferContext.fillStyle = 'black';
		this.backBufferContext.font = '50px Arial';
		//Refresh canvas
		this.backBufferContext.fillRect(0,0, this.screenWidth, this.screenWidth);
		if(this.gameState === "main menu") {
			this.drawMenu();
		}
		else if(this.gameState === "controls") {
			this.drawControls();
		}
	}
}

//Make sure the Script immediately starts up with the menu.
new Menu();
