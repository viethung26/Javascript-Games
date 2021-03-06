const SIZE = 50;
const MOVE_UP = 38;
const MOVE_LEFT = 37;
const MOVE_RIGHT = 39;
const MOVE_DOWN = 40;
const SHOOT = 32;
const TEAM_ALLY = 1;
const TEAM_ENEMY = -1;
const ALIVE = 1;
const DEAD = 0;
const ISOVER = 0;
const ISSTART = 1;
const ISPLAYING = 2;
const ISPAUSE = 3;
var backgroundImg = new Image();
var spaceShipImg = new Image();
backgroundImg.src = 'ui/space.jpg';
spaceShipImg.src = 'ui/mship.png';
var isPlaying = ISSTART;
var gameScreen = document.getElementById('gamescreen');
var ctx = gameScreen.getContext("2d");

var mySShip, bulletManager, sShipManager;
var id = setInterval(run, 50);
//        
function SpaceShip(team, status, x, y, acelerateX) {
	this.team = team;
	this.status = status;
	this.x = x;
	this.y = y;
	this.acelerateX = acelerateX;
	this.shoot = function() {
		bulletManager.push(new Bullet(this.team, this.x, this.y - this.team * SIZE / 2));
	}
}

function Bullet(team, x, y) {
	this.team = team;
	this.x = x;
	this.y = y;
	this.shoot = function() {
		if (this.team == TEAM_ALLY)
			this.y -= 10;
		else this.y += 10;
	}
}

function initGame() {
	mySShip = new SpaceShip(TEAM_ALLY, ALIVE, 150, 490, 0);
	bulletManager = [];
	sShipManager = [];
	sShipManager.push(mySShip);
	sShipManager.push(new SpaceShip(TEAM_ENEMY, ALIVE, 150, 10, 0));
}

function keyDownEvent(event) {
	switch (event.keyCode) {
		case MOVE_UP:
			break;
		case MOVE_DOWN:
			break;
		case MOVE_LEFT:
			mySShip.acelerateX -= 6;
			if (mySShip.acelerateX < -18) mySShip.acelerateX = -18;
			break;
		case MOVE_RIGHT:
			mySShip.acelerateX += 6;
			if (mySShip.acelerateX > 18) mySShip.acelerateX = 18;
			break;
		case SHOOT:
			mySShip.shoot();
			audioElement.play();
			break;
		case 65:
			sShipManager[1].shoot();
		case 13:
			isPlaying = ISPLAYING;
			break;
		default:
			console.log(event.keyCode);
			break;
	}
}

function keyUpEvent(event) {
	switch (event.keyCode) {
		case MOVE_UP:
			break;
		case MOVE_DOWN:
			break;
		case MOVE_LEFT:
			mySShip.acelerateX = 0;
			break;
		case MOVE_RIGHT:
			mySShip.acelerateX = 0;
			break;
	}
}

function moveShip() {
	mySShip.x += mySShip.acelerateX;
	if (mySShip.x > 300 - SIZE / 2) {
		mySShip.x = 300 - SIZE / 2;
		mySShip.acelerateX = 0;
	}
	if (mySShip.x < 0 + SIZE / 2) {
		mySShip.x = 0 + SIZE / 2;
		mySShip.acelerateX = 0;
	}
}

function update() {
	for (i in bulletManager) {
		bulletManager[i].shoot();
		//                console.log(bulletManager.length);
		if (bulletManager[i].y > 500 || bulletManager[i].y < 0) {
			bulletManager.splice(i, 1);
			continue;
		}
		for (e in sShipManager) {
			if (checkCollision(bulletManager[i], sShipManager[e])) sShipManager[e].status = DEAD;
		}
		drawBullet(bulletManager[i]);
	}

	for (i in sShipManager) {
		if (sShipManager[i].status == ALIVE) {
			//                    enemyManager[i].shoot();
			drawSpaceShip(sShipManager[i]);
		} else sShipManager.splice(i, 1);
	}
	//            console.log(bulletManager[0].team);
}
//        
function drawBackground() {
	ctx.drawImage(backgroundImg,0,0);
//            ctx.fillStyle = "#ffffff";
//            ctx.fillRect(0, 0, 300, 530);
	if (isPlaying != ISPLAYING) {
		ctx.font = "20px arial";
		ctx.fillStyle = "#f00";
		ctx.fillText("Press \"Enter\" to start game", 20, 250);
	}
}

function drawSpaceShip(sShip) {
	ctx.fillStyle = "#f00";
	if (sShip.team == TEAM_ENEMY) {
		ctx.fillStyle = "#1f18e2";
		ctx.fillRect(sShip.x - SIZE / 2, sShip.y - SIZE / 2, SIZE, SIZE);
	} else {
		ctx.drawImage(spaceShipImg, sShip.x - SIZE / 2, sShip.y - SIZE / 2, SIZE, SIZE);
	}
	ctx.fillStyle = "#ff0";
	ctx.fillRect(sShip.x - 1, sShip.y - 1, 2, 2)
}

function drawBullet(bullet) {
	ctx.fillStyle = "#6200ff";
	ctx.fillRect(bullet.x - 1, bullet.y - 1, 2, 2);
}

function checkCollision(bullet, sShip) {
	if (bullet.team == sShip.team) return false;
	if (bullet.x > sShip.x - SIZE / 2 && bullet.x < sShip.x + SIZE / 2 && bullet.y > sShip.y - SIZE / 2 && bullet.y < sShip.y + SIZE / 2)
		return true;
	return false;
}

// Audio 
audioElement = document.createElement("audio");
document.body.appendChild(audioElement);
var audioType = supportedAudioFormat(audioElement);
audioElement.setAttribute("src", "audio/shoot.wav");

function supportedAudioFormat(audio) {
	var returnExtension = "";
	if (audio.canPlayType("audio/ogg") == "probably" || audio.canPlayType("audio/ogg") == "maybe") {
		returnExtension = "ogg";
	} else if (audio.canPlayType("audio/wav") == "probably" || audio.canPlayType("audio/wav") == "maybe") {
		returnExtension = "wav";
	} else if (audio.canPlayType("audio/mp3") == "probably" || audio.canPlayType("audio/mp3") == "maybe") {
		returnExtension = "mp3";
	}
	return returnExtension;
}

function run() {
	drawBackground();
	if (isPlaying == ISPLAYING) {
		moveShip();
		update();
		if (mySShip.status == DEAD) {
			clearInterval(id);
			isPlaying = ISOVER;
			alert("gameOver");
		}
	}
	if (isPlaying == ISSTART) {
		initGame();
	}

}