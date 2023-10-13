// Until 22 min
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

// color palette 1 : "#F20F79", "#04BFBF", "#F2B90C", "#8C4E03", "#F25C05"
// color palette 2 : "#2185C5", "#7ECEFD", "FF7F66"
var colors = ["#04BFBF", "#8C4E03", "#F20F79"];

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

function rotate(velocity, angle) {
  const rotateVelocities = {
    x: velocity.x * Math.cos(angle) - velocity.y * Math.sin(angle),
    y: velocity.x * Math.sin(angle) + velocity.y * Math.cos(angle),
  };
  return rotateVelocities;
}

/**
 * Swaps out two cooloding particles' x and y velocities after running through
 * an elastic collision reaction equation
 *
 * @param Object | particle    | A particle object with x and y coordinates, plus velocity
 * @param Object | otherparticle    | A particle object with x and y coordinates, plus velocity
 * @return Null | Dose not return a value
 */

function resolveCollision(particle, otherparticle) {
  const xVelocityDiff = particle.velocity.x - otherparticle.velocity.x;
  const yVelocityDiff = particle.velocity.y - otherparticle.velocity.y;

  const xDist = otherparticle.x - particle.x;
  const yDist = otherparticle.y - particle.y;

  // Prevent accidental overlap of particle
  if (xVelocityDiff * xDist + yVelocityDiff * yDist >= 0) {
    // Grab angle between two colliding particle
    const angle = -Math.atan2(
      otherparticle.y - particle.y,
      otherparticle.x - particle.x
    );

    // Store mass in var for better readability collision equation
    const m1 = particle.mass;
    const m2 = otherparticle.mass;

    // Velocity before equation
    const u1 = rotate(particle.velocity, angle);
    const u2 = rotate(otherparticle.velocity, angle);

    // Velocity after 1d collision equation
    const v1 = {
      x: (u1.x * (m1 - m2)) / (m1 + m2) + (u2.x * 2 * m2) / (m1 + m2),
      y: u1.y,
    };
    const v2 = {
      x: (u2.x * (m1 - m2)) / (m1 + m2) + (u1.x * 2 * m2) / (m1 + m2),
      y: u2.y,
    };

    // Final velocity after rotating axis back to original location
    const vFinal1 = rotate(v1, -angle);
    const vFinal2 = rotate(v2, -angle);

    // Swap particle velocity for realistic bounce effect
    particle.velocity.x = vFinal1.x;
    particle.velocity.y = vFinal1.y;

    otherparticle.velocity.x = vFinal2.x;
    otherparticle.velocity.y = vFinal2.y;
  }
}

// Object
function Particle(x, y, radius, color) {
  this.x = x;
  this.y = y;

  this.velocity = {
    x: (Math.random() - 0.5) * 5,
    y: (Math.random() - 0.5) * 5,
  };

  this.radius = radius;
  this.color = color;
  this.opacity = 0;
  this.mass = 1;

  this.update = (particles) => {
    this.draw();

    for (let i = 0; i < particles.length; i++) {
      if (this === particles[i]) continue;
      if (
        distance(this.x, this.y, particles[i].x, particles[i].y) -
          this.radius * 2 <
        0
      ) {
        resolveCollision(this, particles[i]);
      }
    }

    if (this.x - this.radius <= 0 || this.x + this.radius >= innerWidth) {
      this.velocity.x = -this.velocity.x;
    }

    if (this.y - this.radius <= 0 || this.y + this.radius >= innerHeight) {
      this.velocity.y = -this.velocity.y;
    }

    // mouse collision detection
    if (
      distance(mouse.x, mouse.y, this.x, this.y) < 120 &&
      this.opacity < 0.2
    ) {
      this.opacity += 0.02;
    } else if (this.opacity > 0) {
      this.opacity -= 0.02;
      this.opacity = Math.max(0, this.opacity);
    }

    this.x += this.velocity.x;
    this.y += this.velocity.y;
  };

  this.draw = () => {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.save();
    c.globalAlpha = this.opacity;
    c.fillStyle = this.color;
    c.fill();
    c.restore();
    c.strokeStyle = this.color;
    c.stroke();

    c.closePath();
  };
}

// Implementation
let particles;

function init() {
  particles = [];
  for (let i = 0; i < 300; i++) {
    const radius = 15;
    let x = randomIntFromRange(radius, canvas.width - radius);
    let y = randomIntFromRange(radius, canvas.height - radius);

    const color = randomColor(colors);

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
    Particle.update(particles);
  });
}
init();
animate();
// --------------------------------------------------------------------------------------------------------------------------
