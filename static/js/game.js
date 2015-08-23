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
	var momResetInterval = momIsHereInterval + 200;
	var momReset = false;
	var babyTaken = false;
	var babyMissing = false;
	var gameWin = false;

	// create textures
	var monsterText = PIXI.Texture.fromImage('static/img/monster.png');
	var bookText = PIXI.Texture.fromImage('static/img/book.png');
	var roomText = PIXI.Texture.fromImage('static/img/room.png');
	var dresserText = PIXI.Texture.fromImage('static/img/dresser.png');
	var chestText = PIXI.Texture.fromImage('static/img/chest.png');
	var cribBabyText = PIXI.Texture.fromImage('static/img/babynormal.png');
	var cribText = PIXI.Texture.fromImage('static/img/crib.png');
	var babyText = PIXI.Texture.fromImage('static/img/baby.png');
	var walkText1 = PIXI.Texture.fromImage('static/img/walk/sprite_1.png');
	var walkText2 = PIXI.Texture.fromImage('static/img/walk/sprite_2.png');
	var walkText3 = PIXI.Texture.fromImage('static/img/walk/sprite_3.png');
	var climbText1 = PIXI.Texture.fromImage('static/img/climbing/dude1.png');
	var climbText2 = PIXI.Texture.fromImage('static/img/climbing/dude2.png');
	var climbText3 = PIXI.Texture.fromImage('static/img/climbing/dude3.png');
	var climbText4 = PIXI.Texture.fromImage('static/img/climbing/dude4.png');
	var climbText5 = PIXI.Texture.fromImage('static/img/climbing/dude5.png');

	var allTextures = [monsterText, bookText, roomText, dresserText, chestText, 
						cribBabyText, walkText1, walkText2, walkText3, climbText1, 
						climbText2, climbText3, climbText4, climbText5];

	// create sprites from textures
	var monster = new PIXI.Sprite(monsterText);
	var book = new PIXI.Sprite(bookText);
	var room = new PIXI.Sprite(roomText);
	var dresser = new PIXI.Sprite(dresserText);
	var chest = new PIXI.Sprite(chestText);
	var cribBaby = new PIXI.Sprite(cribBabyText);
	var baby = new PIXI.Sprite(babyText);
	
	//create movies from texture lists
	var walk = new PIXI.extras.MovieClip([walkText1, walkText2, walkText3])
	var climb = new PIXI.extras.MovieClip([climbText1, climbText2, climbText3, climbText4, climbText5])

	//create text
	var momComingText = new PIXI.Text('... (better hide)', {'fill':'white'});
	var momHereText = new PIXI.Text('Go to sleep little one...', {'fill':'white'});
	var caughtText = new PIXI.Text('Ahhh, get away from my baby you Monster!');
	var babyMissingText = new PIXI.Text('Oh No! Where did baby go?! Check everywhere!');

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

	resetGame();

	//main loop
	gameLoop();

	function gameLoop() {
		requestAnimationFrame(gameLoop);

		if (timer === momComesInterval){
			momComingText.visible = true;
		}
		if (timer === momIsHereInterval){
			if (!isHiding){
				gameOver = true;
				restartCount = 0;
			} else if (babyTaken){
				babyMissing = true;
				gameOver = true;
				restartCount = 0;
				momComingText.visible = false;
			} else {
				momComingText.visible = false;
				momHereText.visible = true;
				momReset = true;
			}
		}
		if (gameOver){
			if (restartCount === 500){
				resetGame();	
			}
			if (Math.round(screenFadeContainer.alpha * 100) / 100 !== 1.00){
				screenFadeContainer.alpha += 0.01;
			}
			if (babyMissing){
				babyMissingText.visible = true;
			} else {
				caughtText.visible = true;
			}
			restartCount += 1;

		}

		if (gameWin){
			console.log("I win");
		}

		if (momReset){
			if (timer === momResetInterval){
				momHereText.visible = false;
				timer = 0;
			}
		}

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

		if (babyTaken) {
			baby.x = monster.x;
			baby.y = monster.y - 25;
		}

		if (monster.x > 630 && monster.y < 285 && monster.y > 150 && monster.x < 800){
			climb.x = monster.x;
			climb.y = monster.y;
			walk.x = monster.x;
			walk.y = monster.y;
			if (monster.vy === 0 && monster.vx === 0){
				climb.stop();
			}
			else if (!climb.playing){
				climb.visible = true;
				walk.visible = false;
				monster.visible = false;
				climb.play();
			}
		} else if (climb.visible){
			if (monster.x < 631){
				monster.x = 631;
				climb.x = 631;
				walk.x = 631;
			}
			else if (monster.x > 799){
				monster.x = 799;
				climb.x = 799;
				walk.x = 799;
			}
			if (monster.y < 151){
				monster.y = 151;
				climb.y = 151;
				climb.stop();
				walk.y = 151;
			}
			else if (monster.y > 285){
				climb.stop();
				climb.visible = false;
				walk.visible = true;
			}
		} else {
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
					climb.visible = false;
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
	}

	function hideMonster() {
		for (spot in hidingSpots){
			var spot = hidingSpots[spot];
			if (isCollision(monster, spot)){
				if (!isHiding && hidePressed){
					if (stage.getChildIndex(monster) > stage.getChildIndex(spot)) {
						stage.swapChildren(monster, spot);
						if (babyTaken){
							baby.visible = false;
						}
					}
					isHiding = true;
				}
			}
			if (!hidePressed){
				if (stage.getChildIndex(spot) > stage.getChildIndex(monster)) {
					stage.swapChildren(monster, spot);
					if (babyTaken){
						baby.visible = true;
					}
				}
				stage.setChildIndex(spot, 3);
				isHiding = false;
			}
		}
	}

	function takeBaby() {
		cribBaby.texture = cribText;
		babyTaken = true;
		baby.x = monster.x;
		baby.y = monster.y - 25;
		baby.visible = true;
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
		if (monster.x > 680 && monster.x < 735 && monster.y < 230 && monster.y > 185){
			takeBaby();
		} else if (monster.x > 150 && monster.x < 250 && monster.y < 300 && babyTaken){
			gameWin = true;
		} else {
			hidePressed = true;
		}
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
		monster.visible = true;
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
		cribBaby.texture = cribBabyText;
	}

	function setupWalk(){
		walk.anchor.x = 0.5;
		walk.anchor.y = 0.5;
		walk.scale.x = 4;
		walk.scale.y = 4;
		walk.visible = false;
		walk.animationSpeed = 0.1;
		walk.visible = false;
	}

	function setupClimb(){
		climb.anchor.x = 0.5;
		climb.anchor.y = 0.5;
		climb.scale.x = 4;
		climb.scale.y = 4;
		climb.visible = false;
		climb.animationSpeed = 0.4;
		climb.visible = false;
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
		caughtText.visible = false;
	}

	function setupBabyText(){
		babyMissingText.anchor.x = 0.5;
		babyMissingText.anchor.y = 0.5;
		babyMissingText.x = 400;
		babyMissingText.y = 200;
		babyMissingText.visible = false;
	}

	function setupBaby(){
		baby.anchor.x = 0.5;
		baby.anchor.y = 0.5;
		baby.visible = false;
		baby.rotation = Math.PI/2;
		baby.scale.x = 4;
		baby.scale.y = 4;
	}

	function isCollision(r1, r2) {
		if (monster.scale.x < 0) {
			return !(r2.x > (r1.x - r1.width / 2) || 
				(r2.x + r2.width / 2) < r1.x || 
				r2.y > (r1.y + r1.height / 2) ||
				(r2.y + r2.height / 2) < r1.y);
		
		} else {
			return !(r2.x > (r1.x + r1.width / 2) || 
				(r2.x + r2.width / 2) < r1.x || 
				r2.y > (r1.y + r1.height / 2) ||
				(r2.y + r2.height / 2) < r1.y);
		}
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
		momResetInterval = momIsHereInterval + 200;
		momReset = false;
		babyTaken = false;
		babyMissing = false;
		gameWin = false;

		//create checks
		isHiding = false;
		hidePressed = false;
		//add to container
		screenFadeContainer.addChild(fullSceenCover); 
		screenFadeContainer.addChild(caughtText);
		screenFadeContainer.addChild(babyMissingText);
		
		setupMonster();
		setupBook();
		setupRoom();
		setupDresser();
		setupChest();
		setupCrib();
		setupWalk();
		setupClimb();
		setupMomComing();
		setupMomHere();
		setupCaught();
		setupBabyText();
		setupBaby();

		//add sprites to stage
		stage.addChild(room);
		stage.addChild(book);
		stage.addChild(dresser);
		stage.addChild(chest);
		stage.addChild(cribBaby);
		stage.addChild(monster);
		stage.addChild(baby);
		stage.addChild(walk);
		stage.addChild(climb);
		stage.addChild(momComingText);
		stage.addChild(momHereText);

		stage.addChild(screenFadeContainer);
	}

});
