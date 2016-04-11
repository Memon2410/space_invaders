function initPage(){

	var game = new Phaser.Game(800, 700, Phaser.AUTO, '', { preload: preload, create: create, update: update });

	var player;
	var bullets;
	var bulletTime = 0;
	var cursors;
	var explosions;
	var score = 0;
	var scoreString = '';
	var scoreText;
	var lives;
	var enemyBullet;
	var firingTimer = 0;
	var stateText;
	var livingEnemies = [];
	var velocityX;
	var velocityShip = 3000;
	var velocityMult = 0;

	var alien1;
	var alien2;
	var alien3;

	var aliens;

	var sounds;
	var music

	WebFontConfig = {
		google: { families: [ 'VT323::latin' ] }
	};

	function preload() {
		game.load.image('ship', './assets/img/ship.jpg');
		game.load.spritesheet('explode', './assets/img/explode.png', 103, 71);
		game.load.spritesheet('enemyBullet', './assets/img/enemy_shoot.png', 12, 22);
		game.load.image('bullet', './assets/img/shoot.jpg');
		game.load.spritesheet('alien1', './assets/img/alien1.png', 50, 34);
		game.load.spritesheet('alien2', './assets/img/alien2.png', 50, 32);
		game.load.spritesheet('alien3', './assets/img/alien3.png', 50, 33);

		game.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1/webfont.js');
		game.load.audio('music', './assets/audio/music.mp3');
	}

	function create() {
		/* WORLD */
		game.physics.startSystem(Phaser.Physics.ARCADE);

		//  Bullets group
		bullets = game.add.group();
		bullets.enableBody = true;
		bullets.physicsBodyType = Phaser.Physics.ARCADE;
		bullets.createMultiple(30, 'bullet');
		bullets.setAll('anchor.x', 0.5);
		bullets.setAll('anchor.y', 1);
		bullets.setAll('outOfBoundsKill', true);
		bullets.setAll('checkWorldBounds', true);

		// The enemy's bullets
		enemyBullets = game.add.group();
		enemyBullets.enableBody = true;
		enemyBullets.physicsBodyType = Phaser.Physics.ARCADE;
		enemyBullets.createMultiple(30, 'enemyBullet');
		enemyBullets.setAll('anchor.x', 0.5);
		enemyBullets.setAll('anchor.y', 1);
		enemyBullets.setAll('outOfBoundsKill', true);
		enemyBullets.setAll('checkWorldBounds', true);
		enemyBullets.callAll('animations.add', 'animations', 'moveit', 0,1, true);
		enemyBullets.callAll('animations.play', 'animations', 'moveit');

		/* PLAYER [ship] */
		player = game.add.sprite(game.world.width/2, game.world.height - 50, 'ship');
		player.anchor.setTo(0.5, 0.5);
		game.physics.enable(player, Phaser.Physics.ARCADE);
		player.body.collideWorldBounds = true;

		//  The score
		scoreString = 'SCORE : ';
		scoreText = game.add.text(10, 30, scoreString + score, { font: '24px VT323', fill: '#fff' });

		//  Lives
		lives = game.add.group();
		game.add.text(game.world.width - 285, 30, 'LIVES', { font: '24px VT323', fill: '#fff' });

		//  Text
		stateText = game.add.text(game.world.centerX,game.world.centerY,' ', { font: '60px VT323', fill: '#00fc01', align: "center" });
		stateText.anchor.setTo(0.5, 0.5);
		stateText.visible = false;

		for (var i = 0; i < 3; i++) {
			var ship = lives.create(game.world.width - 180 + (60 * i), 40, 'ship');
			ship.anchor.setTo(0.5, 0.5);
		}

		/* ALIENS */
		aliens = game.add.group();
		aliens.enableBody = true;
		aliens.physicsBodyType = Phaser.Physics.ARCADE;

		createAliens();
		
		cursors = game.input.keyboard.createCursorKeys();
		fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

		//  An explosion pool
		explosions = game.add.group();
		explosions.createMultiple(48, 'explode');
		explosions.forEach(setupInvader, this);

		// SOUND
		music = game.add.audio('music', 1, true);
        
		sounds = [music];

		//game.sound.setDecodedCallback(sounds, start, this);
		setTimeout(start, 500);
	}

	function start() {
		sounds.shift();

		music.play('', 0, 1, true);
		//music.loopFull(0.6);
		//music.onLoop.add(hasLooped, this);
	}

	function hasLooped(sound) {
		console.log('´ç´ç´ç´ç´ç´ç´ç')
	}

	function update() {

		if (player.alive) {
			if (cursors.left.isDown) {
				//  Move to the left
				player.body.velocity.x = -150;
			} else if (cursors.right.isDown) {
				//  Move to the right
				player.body.velocity.x = 150;
			}

			if (fireButton.isDown) {
				fireBullet();
			}

			if (game.time.now > firingTimer) {
				enemyFires();
			}
			//  Run collision
			game.physics.arcade.overlap(bullets, aliens, collisionHandler, null, this);
			game.physics.arcade.overlap(enemyBullets, player, enemyHitsPlayer, null, this);
		
		}
	}

	function createAliens() {
		velocityMult += 0.2;
		velocityX = velocityShip / velocityMult;

		for (var i = 0; i < 12; i++) {
			//  Create a alien inside of the 'aliens' group
			alien = aliens.create(i * 50, 0, 'alien1');
			alien.animations.add('fly', [ 0, 1], 1, true);
			alien.play('fly');
			alien.body.moves = false;

			alien = aliens.create(i * 50, 40, 'alien2');
			alien.animations.add('fly', [ 0, 1], 1, true);
			alien.play('fly');
			alien.body.moves = false;
			alien = aliens.create(i * 50, 80, 'alien2');
			alien.animations.add('fly', [ 0, 1], 1, true);
			alien.play('fly');
			alien.body.moves = false;

			alien = aliens.create(i * 50, 120, 'alien3');
			alien.animations.add('fly', [ 0, 1], 1, true);
			alien.play('fly');
			alien.body.moves = false;
			alien = aliens.create(i * 50, 160, 'alien3');
			alien.animations.add('fly', [ 0, 1], 1, true);
			alien.play('fly');
			alien.body.moves = false;
		}
		
		aliens.y = 100;

		//  All this does is basically start the invaders moving
		var tween = game.add.tween(aliens).to( {x: 200}, 2000, Phaser.Easing.Linear.None, true, 0, 1000, true);
		
		//  When the tween loops it calls descend		
		tween.onLoop.add(descend, this);
	}

	function setupInvader (alien) {
		alien.anchor.x = 0.5;
		alien.anchor.y = 0.5;
		alien.animations.add('explode');
	}

	function descend() {
		aliens.y += 10

		if (aliens.y >= 450) {
			player.kill();
			enemyBullets.callAll('kill');

			stateText.text=" GAME OVER \n Click to restart";
			stateText.visible = true;

			//the "click to restart" handler
			game.input.onTap.addOnce(restart,this);
		}
	}

	function collisionHandler (bullet, alien) {
		//  When a bullet hits an alien we kill them both
		bullet.kill();
		alien.kill();

		//  Increase the score
		score += 20;
		scoreText.text = scoreString + score;

		//  And create an explosion :)
		var explosion = explosions.getFirstExists(false);
		explosion.reset(alien.body.x, alien.body.y);
		explosion.play('explode', 30, false, true);

		if (aliens.countLiving() == 0) {
			score += 1000;
			scoreText.text = scoreString + score;

			enemyBullets.callAll('kill',this);

			setTimeout(continueGame, 1000);
		}

	}

	function enemyHitsPlayer (player,bullet) {
		bullet.kill();
		live = lives.getFirstAlive();

		if (live) {
			live.kill();
		}

		//  Explosion :)
		var explosion = explosions.getFirstExists(false);
		explosion.reset(player.body.x, player.body.y);
		explosion.play('explode', 4, false, true);

		player.kill();

		// When the player dies
		if (lives.countLiving() < 1) {
			player.kill();
			enemyBullets.callAll('kill');

			stateText.text=" GAME OVER \n Click to restart";
			stateText.visible = true;

			//the "click to restart" handler
			game.input.onTap.addOnce(restart,this);
		} else {
			setTimeout(livePlayer, 1000);
		}

		function livePlayer() {
			player.revive();
		}
	}

	function enemyFires () {
		//  Grab the first bullet we can from the pool
		enemyBullet = enemyBullets.getFirstExists(false);
		livingEnemies.length = 0;
		
		//enemyBullet.play('enemyBullet', 4, false, true);
		var shoot = enemyBullet.animations.add('shoot');
		enemyBullet.animations.play('shoot', 15, true);

		aliens.forEachAlive(function(alien){
			// put every living enemy in an array
			livingEnemies.push(alien);
		});

		if (enemyBullet && livingEnemies.length > 0) {
			var random=game.rnd.integerInRange(0,livingEnemies.length-1);

			// randomly select one of them
			var shooter=livingEnemies[random];
			// And fire the bullet from this enemy
			enemyBullet.reset(shooter.body.x, shooter.body.y);

			game.physics.arcade.moveToObject(enemyBullet,player,120);
			firingTimer = game.time.now + 2000;
		}

	}

	function fireBullet() {
		if(game.time.now > bulletTime) {
			//  Grab the first bullet we can from the pool
        	bullet = bullets.getFirstExists(false);
			
			if (bullet) {
				bullet.reset(player.x, player.y + 8);
				bullet.body.velocity.y = -400;
				bulletTime = game.time.now + 200;
			}
		}
	}

	function resetBullet (bullet) {
		bullet.kill();
	}

	function restart () {
		bulletTime = 0;
		score = 0;
		firingTimer = 0;
		livingEnemies = [];
		velocityShip = 3000;
		velocityMult = 0;
		//Score
		score = 0;
		scoreText.text = scoreString + score;

		// Velocity
		velocityMult = 0;

		//  A new level starts resets the life count
		lives.callAll('revive');
		
		//  And brings the aliens back from the dead :)
		aliens.removeAll();
		createAliens();

		//revives the player
		player.revive();
		//hides the text
		stateText.visible = false;

	}

	function continueGame() {
		aliens.removeAll();
		createAliens();
	}

};