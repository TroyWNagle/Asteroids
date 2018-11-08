import Game from './game.js';
import './game.css';

export default class Menu {
	constructor() {
		this.screenWidth = 1000
		this.gameState = 'menu'
		this.highlighted = 'start'
		this.buttons = ['start', 'options']

		window.onmousedown = this.handleMouseDown;
		window.onkeydown = this.handleKeyDown;
	}

	handleKeyDown(event){
		event.preventDefualt();

		if(this.gameState === 'menu') {

		}
	}

}
new Game();
