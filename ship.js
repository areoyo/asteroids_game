//Alejandra Delgado Reoyo
                            /* JUEGO DE ASTEROIDES*/

var canvas;
var ctx;
var img;
var lives_img;
var game_over;
var finish;

var ship;
var shapes = [];
var shots = [];

var lives = 3;
var play_time = new Date().getTime(); //ms
var level = 0;
var points = 0;

const speed = 2; // vel. de desplazamiento (v)
const speed_rotate = 0.5; // vel. de rotacion (w)
var speed_shapes = 2; // vel. asteroides
var speed_level = 0; // vel. de ni
var temp = 75; // tiempo inicial entre asteroides
var a = 7;  // radio min de asteroide

function Create_ship (x, y, color) {
  this.x = x;
  this.y = y;
  this.radious = 12;
  this.color = color;

  this.v = 0.0;
  this.w = 0.0;
  this.angle = 0.0;
  this.time = new Date().getTime();

  this.move = function() {

    var now = new Date().getTime();
    var speed2 = now - this.time;
    this.time = now;
    this.angle += this.w * (speed2/1000);
    this.x += this.v * Math.sin(this.angle);
    this.y -= this.v * Math.cos(this.angle);

    if (this.y < 0) {
      this.y = canvas.height;
    } else if (this.y >= canvas.height) {
      this.y = 0;
    };

    if (this.x < 0) {
      this.x = canvas.width;
    } else if (this.x >= canvas.width) {
      this.x = 0;
    };

  }

  this.draw = function() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);
    ctx.scale(3, 3);
    ctx.strokeStyle = this.color;

    ctx.beginPath();
    ctx.moveTo(-1.0, 3.0);
    ctx.lineTo(0.0, 0.0);
    ctx.lineTo(1.0, 3.0);
    ctx.lineWidth = 4;
    ctx.stroke();

		ctx.restore();
  }
}

function Asteroids (x, y, radious, color) {
	this.x = x;
	this.y = y;
	this.radious = radious;
	this.color = color;
  this.desp = Math.round(Math.random() * ( 3 - (-3)) + (-3))

	this.draw = function() {
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.radious, 0, 2*Math.PI, false);
		ctx.strokeStyle = this.color;
    ctx.lineWidth = 1;
		ctx.stroke();
	}

  this.move = function(){
    this.x += this.desp;
    this.y += speed_shapes;
  }
}

function Create_shot(x, y, speed, color) {
  this.x = x;
  this.y = y;
  this.v = speed;
  this.radious = 2;
  this.color = color;
  this.angle = ship.angle;

  this.draw = function() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radious, 0, 2*Math.PI, false);
    ctx.fillStyle = this.color;
    ctx.lineWidth = 3;
    ctx.fill();
  }

  this.move = function(){
    this.x += this.v * Math.sin(this.angle);
    this.y -= this.v * Math.cos(this.angle);
  }
}

function objectHandler() {

  //CREO ASTEROIDES
  var xWidth = canvas.width - 10;
  var xx = Math.round(Math.random() * (xWidth - 10) - 10);
  var xxx = Math.round(Math.random() * (xWidth - 20) - 20);
  var rad = Math.round(Math.random() * (30 - 5) + 5);
  var rad2 = Math.round(Math.random() * (40 - 10) + 10);
  if (count.shape() === temp){
    shapes.push(new Asteroids (xx, 0, rad, 'white'));
    shapes.push(new Asteroids (xxx, 0, rad2, 'white'));
    shapes.push(new Asteroids (Math.round((xx+xxx+20)/2), 0, Math.round((rad+rad2+20)/2), 'white'))
    count.restart();
    points += 2;
  };

  // MUEVO OBJETOS
  for(i in shapes){
    shapes[i].move();
  }
  for(s in shots){
    shots[s].move();
  }
  ship.move();
  drawShapes();

  // LIBERO MEMORIA (EXTREMOS)
  for (var i in shapes){
    if ((shapes[i].y < 0) || (shapes[i].x < 0) || (shapes[i].y >= canvas.height) || (shapes[i].x >= canvas.width)){
     shapes.splice (i,1);
     points += 5;
    }
  }
  for (var s in shots){
    if ((shots[s].y < 0) || (shots[s].x < 0) || (shots[s].y >= canvas.height) || (shots[s].x >= canvas.width)){
     shots.splice (s,1);
    }
  }
}

function keyHandler(event) {

	switch(event.keyCode) {
		case 40: //ARROWDOWN
      ship.v += -speed;
			break;
		case 38: //ARROWUP
      ship.v += +speed;
			break;
    case 39: //ARROWRIGHT
      ship.w += speed_rotate;
      break;
    case 37: //ARROWLEFT
      ship.w -= speed_rotate;
      break;
    case 13: //ENTER - INTRO
      shots.push(new Create_shot(ship.x, ship.y, 10, '#ffcc00'));
      break;
		default:
		console.log("Key not handled");
	}

  ship.draw();
}

function crashShapes(ship, asteroids, number) {

  var distX = Math.pow(Math.abs(ship.x - asteroids[number].x), 2);
  var distY = Math.pow(Math.abs(ship.y - asteroids[number].y), 2);
  var dist_shapes = Math.sqrt(distX + distY);

  if (ship.radious + asteroids[number].radious > dist_shapes) {
    asteroids.splice (number,1);
    return true;
  }
}

function drawShapes() {
  ship.draw();
	for(i in shapes) {
		shapes[i].draw();
  }
  for (s in shots) {
    shots[s].draw();
  }

  ctx.font = '20pt Arial';
  ctx.fillStyle = 'WHITE';
  ctx.fillText(points, 25, 40);
}

function nextLevel() {
  var level_time = play_time + 60000;
  if(ship.time >= level_time){
    play_time += 40000; //ms
    speed_level += 1.5;
    points += 50;
    return true;
  }
}

function alive() {

  switch(lives) {
		case 3:
      ctx.drawImage(lives_img, 25, 45);
      ctx.drawImage(lives_img, 70, 45);
      ctx.drawImage(lives_img, 115, 45);
      break;
    case 2:
      ctx.drawImage(lives_img, 70, 45);
      ctx.drawImage(lives_img, 115, 45);
      break;
    case 1:
      ctx.drawImage(lives_img, 115, 45);
      break;
    default:
      stopGame();
  }
}

function counter() {
	this.cont = 0;
	this.shape = function (){
			this.cont++;
			return this.cont;
	}
	this.restart = function (){
			return this.cont = 0;
	}
}

function updateGameArea() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, 0, 0);

  objectHandler();

  for (i in shapes) {
    if (crashShapes(ship, shapes, i)){
      ship.v = 0.0;
      ship.w = 0.0;
      lives--;
    };

    for (s in shots){
      if (crashShapes(shapes[i], shots, s)){
        if (shapes[i].radious >= 15){
          var xx = shapes[i].x;
          var yy = shapes[i].y;
          var rad = shapes[i].radious;
          shapes.push(new Asteroids (xx+20, yy, rad/2, '#ff9f80'));
          shapes.push(new Asteroids (xx-20, yy, rad/2, '#ff9f80'));
          points += 25;
        }
        points += 100;
        shapes.splice(i,1);
      }
    }
  }

  if (nextLevel()) {
    speed_shapes += speed_level;
    level += 1;
    temp += -15;

    if (level >= 5) { temp += -7.5; };
  }
  alive();
}

function stopGame(){
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, 0, 0);
  ctx.drawImage(game_over, 261, 161);
  ctx.font = '20pt Arial';
  ctx.fillStyle = 'WHITE';
  ctx.fillText('SCORE: ' + points, 265, 350);
  clearInterval(finish);
}

function startGame() {
  count = new counter();

  canvas = document.getElementById('space');
  if (!canvas) {
    console.log('Failed to retrieve the <canvas> element');
    return false;
  }
  ctx = canvas.getContext('2d');
  img = document.getElementById('space_img');
  lives_img = document.getElementById('lives_img');
  game_over = document.getElementById('game_over');
  ctx.drawImage(img, 0, 0);

  document.addEventListener('keydown', keyHandler, false);

  ship = new Create_ship(canvas.width/2, canvas.height - 70, "white");

  finish = setInterval(updateGameArea, 26);
}
