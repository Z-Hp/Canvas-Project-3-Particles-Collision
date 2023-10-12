// Initial Setup
var canvas = document.querySelector("canvas");
var c = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Variables
var mouse = {
  x: innerWidth / 2,
  y: innerHeight / 2,
};

var colors = ["#F20F79", "#04BFBF", "#F2B90C", "#8C4E03", "#F25C05"];

// Event Listeners
addEventListener("mousemove", function (event) {
  mouse.x = event.clientX;
  mouse.y = event.clientY;
});

addEventListener("resize", function () {
  canvas.width = innerWidth;
  canvas.height = innerHeight;

  init();
});

addEventListener("click", function () {
  init();
});

// Utility Functions
function randomIntFromRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function randomColor(colors) {
  return colors[Math.floor(Math.random() * colors.length)];
}

// Object
function Particle(x, y, dy, radius, color) {
  this.x = x;
  this.y = y;
  this.dy = dy;
  this.radius = radius;
  this.color = color;

  this.update = function () {
    this.draw = function () {
      c.beginPath();
      c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
      c.fillStyle = this.color;
      c.fill();
      // c.stroke();
      c.closePath();
    };
  };
}

// Implementation

function init() {}

// Animation Loop
function animate() {
  requestAnimationFrame(animate);

  c.clearRect(0, 0, canvas.width, canvas.height);

  for (var i = 0; i < ballArray.length; i++) {
    ballArray[i].update();
  }
}
init();
animate();
// --------------------------------------------------------------------------------------------------------------------------
