// Initial Setup
var canvas = document.querySelector("canvas");
var c = canvas.getContext("2d");

canvas.width = innerWidth;
canvas.height = innerHeight;

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

function distance(x1, y1, x2, y2) {
  const xDist = x2 - x1;
  const yDist = y2 - y1;

  return Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2));
}

// Object
function Particle(x, y, radius, color) {
  this.x = x;
  this.y = y;
  this.radius = radius;
  this.color = color;

  this.update = () => {
    this.draw();
  };

  this.draw = () => {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.strokeStyle = this.color;
    //c.fill();
    c.stroke();
    c.closePath();
  };
}

// Implementation
let particles;

function init() {
  particles = [];
  for (let i = 0; i < 4; i++) {
    const radius = 80;
    let x = randomIntFromRange(radius, canvas.width - radius);
    let y = randomIntFromRange(radius, canvas.height - radius);

    const color = "blue";

    if (i !== 0) {
      for (let j = 0; j < particles.length; j++) {
        if (distance(x, y, particles[j].x, particles[j].y) - radius * 2 < 0) {
          x = randomIntFromRange(radius, canvas.width - radius);
          y = randomIntFromRange(radius, canvas.height - radius);

          j = -1;
        }
      }
    }

    particles.push(new Particle(x, y, radius, color));
  }
}

// Animation Loop
function animate() {
  requestAnimationFrame(animate);

  c.clearRect(0, 0, canvas.width, canvas.height);

  particles.forEach((Particle) => {
    Particle.update();
  });
}
init();
animate();
// --------------------------------------------------------------------------------------------------------------------------
