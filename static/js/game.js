$( document ).ready(function() {

	var renderer = PIXI.autoDetectRenderer(800, 400,{backgroundColor : 0x1099bb});
	document.body.appendChild(renderer.view);

	// create the root of the scene graph
	var stage = new PIXI.Container();

	// create textures
	var bunnyText = PIXI.Texture.fromImage('static/img/bunny.png');
	var bookText = PIXI.Texture.fromImage('static/img/book.png');

	// create sprites from textures
	var monster = new PIXI.Sprite(bunnyText);
	var book = new PIXI.Sprite(bookText);

	setupMonster();
	setupBook();

	//create keybindings
	var left = keyboard(37),
		up = keyboard(38),
		right = keyboard(39),
		down = keyboard(40),
		hide = keyboard(32);

	//create checks
	var isHiding = false;

	//group hiding places
	var hidingSpots = [
		book
	];

	//add sprites to stage
	stage.addChild(monster);
	stage.addChild(book);

	// start animating
	gameLoop();

	function gameLoop() {
		requestAnimationFrame(gameLoop);

		moveMonster();
		checkCollisions();

		// render the container
		renderer.render(stage);

	}

	function moveMonster() {
		//Use the monster.s velocity to make it move
		monster.x += monster.vx;
		monster.y += monster.vy;
		if (monster.x < 0){
			monster.x = 0;
		}
		if (monster.x > 800){
			monster.x = 800;
		}
		if (monster.y < 300){
			monster.y = 300;
		}
		if (monster.y > 400){
			monster.y = 400;
		}
	}

	function checkCollisions() {
		for (spot in hidingSpots){
			var spot = hidingSpots[spot];
			if (isFuzzyCollision(monster, spot)){
				if (!isHiding){
					monster.x = spot.x;
					monster.y = spot.y;
				}
			}
		}
	}

	function keyboard(keyCode) {
		var key = {};
		key.code = keyCode;
		key.isDown = false;
		key.isUp = true;
		key.press = undefined;
		key.release = undefined;

		//The `downHandler`
		key.downHandler = function(event) {
			if (event.keyCode === key.code) {
				if (key.isUp && key.press) key.press();
				key.isDown = true;
				key.isUp = false;
				}
			event.preventDefault();
		};

		//The `upHandler`
		key.upHandler = function(event) {
			if (event.keyCode === key.code) {
				if (key.isDown && key.release) key.release();
				key.isDown = false;
				key.isUp = true;
				}
			event.preventDefault();
		};

		//Attach event listeners
		window.addEventListener(
			"keydown", key.downHandler.bind(key), false
		);
		window.addEventListener(
			"keyup", key.upHandler.bind(key), false
		);
		return key;
	}
	
	left.press = function() {
		monster.vx = -5;
		monster.vy = 0;
	};

	left.release = function() {
		if (!right.isDown && monster.vy === 0) {
			monster.vx = 0;
		}
	};

	right.press = function() {
		monster.vx = 5;
		monster.vy = 0;
	};

	right.release = function() {
		if (!left.isDown && monster.vy === 0) {
			monster.vx = 0;
		}
	};

	up.press = function() {
		monster.vx = 0;
		monster.vy = -3;
	};

	up.release = function() {
		if (!down.isDown && monster.vx === 0) {
			monster.vy = 0;
		}
	};

	down.press = function() {
		monster.vx = 0;
		monster.vy = 3;
	};

	down.release = function() {
		if (!up.isDown && monster.vx === 0) {
			monster.vy = 0;
		}
	};

	function setupMonster(){ // center the sprite's anchor point
		monster.anchor.x = 0.5;
		monster.anchor.y = 0.5;

		// move the sprite to the center of the screen
		monster.position.x = 100;
		monster.position.y = 300;
		monster.vx = 0;
		monster.vy = 0;
	}

	function setupBook(){ // center the sprite's anchor point
		book.anchor.x = 0.5;
		book.anchor.y = 0.5;

		// move the sprite to the center of the screen
		book.position.x = 300;
		book.position.y = 350;
	}

	function isFuzzyCollision(r1, r2) {
		return !(r2.x > (r1.x + r1.width) || 
			(r2.x + r2.width) < r1.x || 
			r2.y > (r1.y + r1.height) ||
			(r2.y + r2.height) < r1.y);
	}

});
