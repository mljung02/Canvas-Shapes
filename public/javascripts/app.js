//shape, square, circle, draw, recolor, whatever the fuck else you want.
var canvas = document.getElementById('canv');
var ctx = canvas.getContext('2d')
var width = document.getElementById('width')
var color = document.getElementById('color')
var shape = document.getElementById('shape')
var recolor = document.getElementById('recolor')
var rain = document.getElementById('rain')
var random = document.getElementById('random')
var discofy = document.getElementById('disco')
var clear = document.getElementById('clear')
var selected,
    requestId
var squares = []
var circles = []
var raining = false;
// var canvas2 = document.getElementById('canv2');

canvas.width = 800;
canvas.height = 500;

// canvas2.height = 1000;
// canvas2.width = 1000;
var drawBase = function () {
  ctx.fillStyle='purple'
  ctx.fillRect(10,10,30,30)
  ctx.beginPath();
  ctx.arc(24, 70, 15, 0, 2 * Math.PI, false);
  ctx.fillStyle = 'green';
  ctx.fill();
  ctx.strokeStyle = 'black'
  ctx.setLineDash([1, 2]);
  ctx.beginPath();
  ctx.moveTo(9,55);
  ctx.lineTo(40,55);
  ctx.lineTo(40,85);
  ctx.lineTo(9,85);
  ctx.lineTo(9,55);
  ctx.stroke()
};

function randomNumber(min,max) {
  return Math.floor(Math.random()*(max-min+1)+min);
}

function colorCycle() {
  ctx.clearRect(0,0,800,500)
  drawBase();
  console.log(squares)
  for (var i = 0; i < squares.length; i++) {
    squares[i].recolor();
    squares[i].draw();
  }
  for (var i = 0; i < circles.length; i++) {
    circles[i].recolor();
    circles[i].draw();
  }
}

//Loops animation for raining down
function rainLoop () {	
  ctx.clearRect(0,0,800,500)
  drawBase()
  for (var i = 0; i < squares.length; i++) {
    if (squares[i].y > 500 - squares[i].width/2 || squares[i].y < 0 + squares[i].width/2){
      squares[i].direction *= -1
    }
    squares[i].y += (1/squares[i].width)*squares[i].direction*50
    squares[i].draw()
  }
  for (var i = 0; i < circles.length; i++) {
    if (circles[i].y > 500 - circles[i].width/2 || circles[i].y < 0 + circles[i].width/2){
      circles[i].direction *= -1
    }
    circles[i].y += (1/circles[i].width)*circles[i].direction*50
    circles[i].draw()
  }
  requestId = window.requestAnimationFrame(rainLoop, canvas);
}


var start = function() {
    if (!requestId) {
       rainLoop();
    }
}

var stop = function() {
    if (requestId) {
       window.cancelAnimationFrame(requestId);
       requestId = undefined;
    }
}

drawBase();



function checkSquare(x,y) {
  if (x >= 10 && x <=40 && y >= 10 && y <= 40) {
    return true
  }
}

function checkCircle(x,y) {
  if (x >= 10 && x <=55 && y >= 55 && y <= 85) {
    return true
  }
}

function getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function Shape(x, y, width, color) {
  this.direction = 1;
  this.x = x;
  this.y = y;
  this.width = width;
  this.color = color;
}

Shape.prototype.recolor = function() {
  this.color= getRandomColor();
}

function Square(x,y,width,color) {
  Shape.call(this,x,y,width,color)
}

Square.prototype = new Shape()

Square.prototype.draw = function() {
  ctx.fillStyle = this.color || 'purple'
  ctx.fillRect(this.x-(this.width/2),this.y-(this.width/2),this.width,this.width)
}

function Circle(x,y,width,color) {
  Shape.call(this,x,y,width,color)
}

Circle.prototype = new Shape();

Circle.prototype.draw = function () {
  ctx.beginPath();
  ctx.arc(this.x, this.y, this.width/2, 0, 2 * Math.PI, false);
  ctx.fillStyle = this.color || 'green';
  ctx.fill();
}

function randomShapes() {
  for (var i = 0; i < 5; i++) {
    var circle = new Circle(randomNumber(0,800),randomNumber(76,424),randomNumber(1,150),getRandomColor())
    circle.draw()
    squares.push(circle);
    var square = new Square(randomNumber(0,800),randomNumber(76,424),randomNumber(1,150),getRandomColor())
    square.draw()
    squares.push(square);
  }
}

randomShapes()


canvas.addEventListener('click', function (e) {
  var x = e.x;
  var y = e.y;
  x -= canvas.offsetLeft;
  y -= canvas.offsetTop;
  
  if (checkSquare(x,y)) {
    selected  = 'square';
    shape.innerHTML = 'Square'
  } else if (checkCircle(x,y)) {
    selected = 'circle'
    shape.innerHTML = 'Circle'
  } else if (selected === 'square') {
    var tempSquare = new Square(x,y,width.value,color.value)
    tempSquare.draw()
    // console.log(tempSquare)
    squares.push(tempSquare)
    console.log(squares)
  } else if (selected === 'circle') {
    var testy = new Circle(x,y,width.value,color.value);
    console.log(testy);
    testy.draw();
    squares.push(testy);
  }
})

recolor.addEventListener('click', colorCycle)

rain.addEventListener('click', function () {
  if (!raining) {
    raining = !raining;
    start()
    rain.innerHTML = "Stop the Rain!"
  } else {
    raining = !raining;
    rain.innerHTML = "Make it Rain!"
    stop()
  }
})

random.addEventListener('click', randomShapes)
var seizure = false;
var seizureId
discofy.addEventListener('click', function () {
  if (!seizure) {
    seizure = !seizure
    seizureId = setInterval(colorCycle, 500)
    discofy.innerHTML = 'Stop the Colors!'
  } else {
    clearInterval(seizureId)
    discofy.innerHTML = 'Seizure Mode'
    seizure = !seizure;
  }
})

clear.addEventListener('click', function () {
  ctx.clearRect(0,0,800,500);
  drawBase();
  squares = [];
})