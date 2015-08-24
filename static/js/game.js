$( document ).ready(function() {
	var renderer = PIXI.autoDetectRenderer(800, 400,{backgroundColor : 0x000000});
	document.body.appendChild(renderer.view);

	// create the root of the scene graph
	var stage = new PIXI.Container();

	// container for fading out 
	var screenFadeContainer = new PIXI.Container();
	screenFadeContainer.scale.x = screenFadeContainer.scale.y = 1;
	screenFadeContainer.alpha = 0;
	var fullSceenCover = rectangle(0, 0, 800, 400, 0x000000, 0x000000, 0 );
	var winSceenCover = rectangle(0, 0, 800, 400, 0x000000, 0x000000, 0 );

	var winningContainer = new PIXI.Container();
	winningContainer.alpha = 0;

	//setup times mom comes
	var timer = 0;
	var momComesInterval;
	var momIsHereInterval;
	var gameOver = false;
	var restartCount = 0;
	var momResetInterval;
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
	var windowText1 = PIXI.Texture.fromImage('static/img/window/sprite_1.png');
	var windowText2 = PIXI.Texture.fromImage('static/img/window/sprite_2.png');
	var windowText3 = PIXI.Texture.fromImage('static/img/window/sprite_3.png');
	var windowText4 = PIXI.Texture.fromImage('static/img/window/sprite_4.png');
	var windowText5 = PIXI.Texture.fromImage('static/img/window/sprite_5.png');
	var fireText1 = PIXI.Texture.fromImage('static/img/fire/sprite_1.png');
	var fireText2 = PIXI.Texture.fromImage('static/img/fire/sprite_2.png');
	var fireText3 = PIXI.Texture.fromImage('static/img/fire/sprite_3.png');
	var fireText4 = PIXI.Texture.fromImage('static/img/fire/sprite_4.png');

	//var allTextures = [monsterText, bookText, roomText, dresserText, chestText, 
						//cribBabyText, walkText1, walkText2, walkText3, climbText1, 
						//climbText2, climbText3, climbText4, climbText5];

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
	var windowSky = new PIXI.extras.MovieClip([windowText1, windowText2, windowText3, windowText4, windowText5])
	var fire = new PIXI.extras.MovieClip([fireText1, fireText2, fireText3, fireText4])

	//create text
	var momComingText = new PIXI.Text('... (better hide)', {'fill':'white'});
	var momHereText = new PIXI.Text('Go to sleep little one...', {'fill':'white'});
	var caughtText = new PIXI.Text('You have been caught!', {'fill':'white'});
	var babyMissingText = new PIXI.Text('The baby is gone and the parents find you in the room!', {'fill':'white'});
	var calvinText = new PIXI.Text('Programming: Calvin Collins', {'fill':'white', wordWrap: true, wordWrapWidth: 200});
	var heatherText = new PIXI.Text('Artwork: Heather Collins', {'fill':'white', wordWrap: true, wordWrapWidth: 200});
	var willyText = new PIXI.Text('Original Music: William Collins', {'fill':'white', wordWrap: true, wordWrapWidth: 200});


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

	// setup sounds
	var mainTrack = new Howl({
		urls: ['static/sound/ludumdaretrack.mp3'],
		autoplay: true,
		loop: true,
		volume: 0.3,
	});

	var bookSound = new Howl({
		urls: ['static/sound/book.mp3'],
		volume: 2,
	});
	var dresserSound = new Howl({
		urls: ['static/sound/dresser.mp3'],
		volume: 0.5,
	});
	var chestSound = new Howl({
		urls: ['static/sound/chest.mp3'],
		volume: 0.5,
	});
	var screamSound = new Howl({
		urls: ['static/sound/scream.mp3'],
		volume: 0.5,
	});
	var giggleSound = new Howl({
		urls: ['static/sound/giggle.mp3'],
		volume: 0.5,
	});
	var footstepsSound = new Howl({
		urls: ['static/sound/footsteps.mp3'],
		volume: 0.5,
	});
	var fireSound = new Howl({
		urls: ['static/sound/fire.mp3'],
		volume: 0.5,
	});

	resetGame();

	//main loop
	gameLoop();

	function gameLoop() {
		requestAnimationFrame(gameLoop);

		if (Math.round(stage.alpha * 100) / 100 !== 1.00){
			stage.alpha += 0.01;
			timer = 0;
		}
		if (gameWin){
			footstepsSound.stop();
			giggleSound.stop();
			if (restartCount === 1000){
				fireSound.fade(0.5, 0.1, 100);
				resetGame();	
			}
			if (restartCount > 100){
				if (Math.round(calvinText.alpha * 100) / 100 !== 1.00){
					calvinText.alpha += 0.01;
				}
			}
			if (restartCount > 300){
				if (Math.round(heatherText.alpha * 100) / 100 !== 1.00){
					heatherText.alpha += 0.01;
				}
			}
			if (restartCount > 500){
				if (Math.round(willyText.alpha * 100) / 100 !== 1.00){
					willyText.alpha += 0.01;
				}
			}
			if (Math.round(winningContainer.alpha * 100) / 100 !== 1.00){
				winningContainer.alpha += 0.01;
			}
			restartCount += 1;
		}

		else if (gameOver){
			if (restartCount === 500){
				resetGame();	
			}
			if (Math.round(screenFadeContainer.alpha * 100) / 100 !== 1.00){
				screenFadeContainer.alpha += 0.01;
			}
			if (babyMissing){
				caughtText.visible = false;
				babyMissingText.visible = true;
			} else {
				caughtText.visible = true;
				babyMissingText.visible = false;
			}
			restartCount += 1;
		} else if (momReset){
			if (timer === momResetInterval){
				momHereText.visible = false;
				timer = 0;
				momReset = false;
			}
		} else {

			if (timer === momComesInterval){
				footstepsSound.play();
				//momComingText.visible = true;
			}

			if (timer === momIsHereInterval){
				footstepsSound.stop();
				if (!isHiding){
					gameOver = true;
					restartCount = 0;
					screamSound.play();
				} else if (babyTaken){
					babyMissing = true;
					gameOver = true;
					restartCount = 0;
					momComingText.visible = false;
					screamSound.play();
				} else {
					//momComingText.visible = false;
					//momHereText.visible = true;
					momReset = true;
				}
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

		// for climbing on the crib
		if (monster.x > 630 && monster.y < 285 && monster.y > 150 && monster.x < 801){
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
		// for boundaries on the crib	
		} else if (climb.visible){
			if (monster.x < 631){
				monster.x = 631;
				climb.x = 631;
				walk.x = 631;
			}
			else if (monster.x > 800){
				monster.x = 800;
				climb.x = 800;
				walk.x = 800;
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
		//for walking
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
				walk.x = monster.x;
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
					if (spot === book){
						bookSound.play();
					}
					if (spot === chest){
						chestSound.play();
					}
					if (spot === dresser){
						dresserSound.play();
					}
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
			giggleSound.play()
			takeBaby();
		} else if (monster.x > 150 && monster.x < 250 && monster.y < 300 && babyTaken && !gameOver){
			fireSound.play();
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
		monster.position.x = 250;
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
		book.position.x = 700;
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

	function setupWindow(){
		windowSky.anchor.x = 0.5;
		windowSky.anchor.y = 0.5;
		windowSky.x = 443;
		windowSky.y = 95;
		windowSky.scale.x = 4;
		windowSky.scale.y = 4;
		windowSky.animationSpeed = 0.05;
		windowSky.play();
	}

	function setupFire(){
		fire.anchor.x = 0.5;
		fire.anchor.y = 0.5;
		fire.x = 400;
		fire.y = 200;
		fire.scale.x = 4;
		fire.scale.y = 4;
		fire.animationSpeed = 0.2;
		fire.play();
	}

	function setupCalvin(){
		calvinText.anchor.x = 0.5;
		calvinText.anchor.y = 0.5;
		calvinText.x = 120;
		calvinText.y = 100;
		calvinText.alpha = 0;
	}

	function setupHeather(){
		heatherText.anchor.x = 0.5;
		heatherText.anchor.y = 0.5;
		heatherText.x = 120;
		heatherText.y = 300;
		heatherText.alpha = 0;
	}

	function setupWilly(){
		willyText.anchor.x = 0.5;
		willyText.anchor.y = 0.5;
		willyText.x = 680;
		willyText.y = 200;
		willyText.alpha = 0;
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
		fullSceenCover = rectangle(0, 0, 800, 400, 0x000000, 0x000000, 0 );
		winningContainer.alpha = 0;

		timer = 0;
		momComesInterval = randomInt(100, 250);
		momIsHereInterval = momComesInterval + randomInt(100,300);
		gameOver = false;
		restartCount = 0;
		momResetInterval = momIsHereInterval + 100;
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

		winningContainer.addChild(winSceenCover);
		winningContainer.addChild(fire);
		winningContainer.addChild(calvinText);
		winningContainer.addChild(heatherText);
		winningContainer.addChild(willyText);
		
		setupMonster();
		setupBook();
		setupRoom();
		setupDresser();
		setupChest();
		setupCrib();
		setupWalk();
		setupClimb();
		setupWindow();
		setupMomComing();
		setupMomHere();
		setupCaught();
		setupBabyText();
		setupBaby();
		setupFire();
		setupCalvin();
		setupHeather();
		setupWilly();

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
		stage.addChild(windowSky);
		stage.addChild(momComingText);
		stage.addChild(momHereText);

		stage.addChild(screenFadeContainer);
		stage.addChild(winningContainer);

		stage.alpha = 0;


	}

});
