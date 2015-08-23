$( document ).ready(function() {
	var renderer = PIXI.autoDetectRenderer(800, 400,{backgroundColor : 0x1099bb});
	document.body.appendChild(renderer.view);

	// create the root of the scene graph
	var stage = new PIXI.Container();

	// container for fading out 
	var screenFadeContainer = new PIXI.Container();
	screenFadeContainer.scale.x = screenFadeContainer.scale.y = 1;
	screenFadeContainer.alpha = 0;
	var fullSceenCover = rectangle(0, 0, 800, 400, 0xFFFFFF, 0xFFFFFF, 0 );

	//setup times mom comes
	var timer = 0;
	var momComesInterval = randomInt(300, 600);
	var momIsHereInterval = momComesInterval + 200;
	var gameOver = false;
	var restartCount = 0;

	// create textures
	var monsterText = PIXI.Texture.fromImage('static/img/monster.png');
	var bookText = PIXI.Texture.fromImage('static/img/book.png');
	var roomText = PIXI.Texture.fromImage('static/img/room.png');
	var dresserText = PIXI.Texture.fromImage('static/img/dresser.png');
	var chestText = PIXI.Texture.fromImage('static/img/chest.png');
	var cribBabyText = PIXI.Texture.fromImage('static/img/babynormal.png');
	var walkText1 = PIXI.Texture.fromImage('static/img/walk/sprite_1.png');
	var walkText2 = PIXI.Texture.fromImage('static/img/walk/sprite_2.png');
	var walkText3 = PIXI.Texture.fromImage('static/img/walk/sprite_3.png');

	var allTextures = [monsterText, bookText, roomText, dresserText, chestText, cribBabyText, walkText1, walkText2, walkText3];

	// create sprites from textures
	var monster = new PIXI.Sprite(monsterText);
	var book = new PIXI.Sprite(bookText);
	var room = new PIXI.Sprite(roomText);
	var dresser = new PIXI.Sprite(dresserText);
	var chest = new PIXI.Sprite(chestText);
	var cribBaby = new PIXI.Sprite(cribBabyText);
	
	//create movies from texture lists
	var walk = new PIXI.extras.MovieClip([walkText1, walkText2, walkText3])

	//create text
	var momComingText = new PIXI.Text('... (better hide)', {'fill':'white'});
	var momHereText = new PIXI.Text('Go to sleep little one...', {'fill':'white'});
	var caughtText = new PIXI.Text('Ahhh, get away from my baby you Monster!');

	//create keybindings
	var left = keyboard(37),
		up = keyboard(38),
		right = keyboard(39),
		down = keyboard(40),
		hide = keyboard(32);

	//create checks
	var isHiding = false;
	var hidePressed = false;

	//group hiding places
	var hidingSpots = [
		book,
		dresser,
		chest
	];

	setupMonster();
	setupBook();
	setupRoom();
	setupDresser();
	setupChest();
	setupCrib();
	setupWalk();
	setupMomComing();
	setupMomHere();
	setupCaught();

	//add to container
	screenFadeContainer.addChild(fullSceenCover); 
	screenFadeContainer.addChild(caughtText);
	

	//add sprites to stage
	stage.addChild(room);
	stage.addChild(book);
	stage.addChild(dresser);
	stage.addChild(chest);
	stage.addChild(cribBaby);
	stage.addChild(monster);
	stage.addChild(walk);
	stage.addChild(momComingText);

	stage.addChild(screenFadeContainer);

	resetGame();

	//main loop
	gameLoop();

	function gameLoop() {

		if (timer === momComesInterval){
			momComingText.visible = true;
		}
		if (timer === momIsHereInterval){
			momComingText.visible = false;
			momHereText.visible = true;
			if (!isHiding){
				gameOver = true;
				restartCount = 0;
			}
		}
		if (gameOver){
			if (restartCount === 500){
				resetGame();	
			}
			screenFadeContainer.alpha += 0.01;
			restartCount += 1;

		}

		requestAnimationFrame(gameLoop);

		moveMonster();
		hideMonster();

		// render the container
		renderer.render(stage);

		timer += 1

	}

	function moveMonster() {
		//Use the monster.s velocity to make it move
		monster.x += monster.vx;
		monster.y += monster.vy;
		if (monster.x < 0){
			monster.x = 0;
		}
		else if (monster.x > 800){
			monster.x = 800;
		}
		if (monster.y < 280){
			monster.y = 280;
		}
		else if (monster.y > 400){
			monster.y = 400;
		}

		if (monster.vx > 0){
			walk.x = monster.x
			walk.scale.x = 4;
			monster.scale.x = 4;
			if (!walk.playing) {
				monster.visible = false;
				walk.visible = true;
				walk.play();
			}
		}
		else if (monster.vx < 0){
			walk.x = monster.x
			walk.scale.x = -4;
			monster.scale.x = -4;
			if (!walk.playing) {
				monster.visible = false;
				walk.visible = true;
				walk.play();
			}
		}
		if (monster.vy < 0 || monster.vy > 0){
			walk.scale.x = monster.scale.x;
			walk.y = monster.y;
			if (!walk.playing) {
				monster.visible = false;
				walk.visible = true;
				walk.play();
			}
		}
		if (monster.vy === 0 && monster.vx === 0){
			walk.y = monster.y;
			monster.visible = true;
			walk.visible = false;
			walk.stop();
		}
	}

	function hideMonster() {
		for (spot in hidingSpots){
			var spot = hidingSpots[spot];
			if (isCollision(monster, spot)){
				if (!isHiding && hidePressed){
					stage.swapChildren(monster, spot);
					isHiding = true;
				} else if (isHiding && !hidePressed){
					stage.swapChildren(monster, spot);
					isHiding = false;
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
		if (!isHiding){
			monster.vx = -3;
			monster.vy = 0;
		}
	};

	left.release = function() {
		if (!right.isDown && monster.vy === 0) {
			monster.vx = 0;
		}
	};

	right.press = function() {
		if (!isHiding){
			monster.vx = 3;
			monster.vy = 0;
		}
	};

	right.release = function() {
		if (!left.isDown && monster.vy === 0) {
			monster.vx = 0;
		}
	};

	up.press = function() {
		if (!isHiding){
			monster.vx = 0;
			monster.vy = -2;
		}
	};

	up.release = function() {
		if (!down.isDown && monster.vx === 0) {
			monster.vy = 0;
		}
	};

	down.press = function() {
		if (!isHiding){
			monster.vx = 0;
			monster.vy = 2;
		}
	};

	down.release = function() {
		if (!up.isDown && monster.vx === 0) {
			monster.vy = 0;
		}
	};

	hide.press = function() {
		hidePressed = true;
	};

	hide.release = function() {
		hidePressed = false;
	};

	function setupMonster(){
		monster.anchor.x = 0.5;
		monster.anchor.y = 0.5;
		monster.position.x = 100;
		monster.position.y = 300;
		monster.vx = 0;
		monster.vy = 0;
		monster.scale.x = 4;
		monster.scale.y = 4;
	}

	function setupBook(){
		book.anchor.x = 0.5;
		book.anchor.y = 0.5;
		book.position.x = 300;
		book.position.y = 350;
		book.scale.x = 4;
		book.scale.y = 4;
	}

	function setupRoom(){
		room.anchor.x = 0;
		room.anchor.y = 0;
		room.position.x = 0;
		room.position.y = 0;
		room.scale.x = 4;
		room.scale.y = 4;
	}

	function setupDresser(){
		dresser.anchor.x = 0.5;
		dresser.anchor.y = 0.5;
		dresser.position.x = 470;
		dresser.position.y = 248;
		dresser.scale.x = 4;
		dresser.scale.y = 4;
	}

	function setupChest(){
		chest.anchor.x = 0.5;
		chest.anchor.y = 0.5;
		chest.position.x = 320;
		chest.position.y = 270;
		chest.scale.x = 4;
		chest.scale.y = 4;
	}

	function setupCrib(){
		cribBaby.anchor.x = 0.5;
		cribBaby.anchor.y = 0.5;
		cribBaby.position.x = 710;
		cribBaby.position.y = 213;
		cribBaby.scale.x = 4;
		cribBaby.scale.y = 4;
	}

	function setupWalk(){
		walk.anchor.x = 0.5;
		walk.anchor.y = 0.5;
		walk.scale.x = 4;
		walk.scale.y = 4;
		walk.visible = false;
		walk.animationSpeed = 0.1;
	}

	function setupMomComing(){
		momComingText.x = 20;
		momComingText.y = 100;
		momComingText.visible = false;
	}

	function setupMomHere(){
		momHereText.x = 20;
		momHereText.y = 100;
		momHereText.visible = false;
	}

	function setupCaught(){
		caughtText.anchor.x = 0.5;
		caughtText.anchor.y = 0.5;
		caughtText.x = 400;
		caughtText.y = 200;
	}

	function isCollision(r1, r2) {
		return !(r2.x > (r1.x + r1.width) || 
			(r2.x + r2.width) < r1.x || 
			r2.y > (r1.y + r1.height) ||
			(r2.y + r2.height) < r1.y);
	}

	function rectangle( x, y, width, height, backgroundColor, borderColor, borderWidth ) { 
		var box = new PIXI.Graphics();
		box.beginFill(backgroundColor);
		box.lineStyle(borderWidth , borderColor);
		box.drawRect(0, 0, width - borderWidth, height - borderWidth);
		box.endFill();
		box.position.x = x + borderWidth/2;
		box.position.y = y + borderWidth/2;
		return box;
	};

	function randomInt(min,max){
		return Math.floor(Math.random()*(max-min+1)+min);
	}

	function resetGame() {
		stage = new PIXI.Container();

		// container for fading out 
		screenFadeContainer = new PIXI.Container();
		screenFadeContainer.scale.x = screenFadeContainer.scale.y = 1;
		screenFadeContainer.alpha = 0;
		fullSceenCover = rectangle(0, 0, 800, 400, 0xFFFFFF, 0xFFFFFF, 0 );

		timer = 0;
		momComesInterval = randomInt(300, 600);
		momIsHereInterval = momComesInterval + 200;
		gameOver = false;
		restartCount = 0;

		//create checks
		isHiding = false;
		hidePressed = false;
		//add to container
		screenFadeContainer.addChild(fullSceenCover); 
		screenFadeContainer.addChild(caughtText);
		
		setupMonster();
		setupBook();
		setupRoom();
		setupDresser();
		setupChest();
		setupCrib();
		setupWalk();
		setupMomComing();
		setupMomHere();
		setupCaught();

		//add sprites to stage
		stage.addChild(room);
		stage.addChild(book);
		stage.addChild(dresser);
		stage.addChild(chest);
		stage.addChild(cribBaby);
		stage.addChild(monster);
		stage.addChild(walk);
		stage.addChild(momComingText);

		stage.addChild(screenFadeContainer);
	}

});
