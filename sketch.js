let particleTexture;
let particleSystem;

function preload() {
  particleTexture = loadImage('/assets/particle_texture.png');
}

function setup() {
  // Create a full-screen canvas and place it behind everything
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.style('position', 'fixed');
  canvas.style('top', '0');
  canvas.style('left', '0');
  canvas.style('z-index', '-1'); // Moves it behind all content

  colorMode(HSB);

  // Initialize the particle system at the bottom-center of the screen
  particleSystem = new ParticleSystem(0, createVector(width / 2, height - 60), particleTexture);
}

function draw() {
  background(20, 10); // Slight transparency for smooth blending

  // Wind effect based on mouse position
  let dx = map(mouseX, 0, width, -0.2, 0.2);
  let wind = createVector(dx, 0);

  // Apply wind and update particle system
  particleSystem.applyForce(wind);
  particleSystem.run();
  for (let i = 0; i < 2; i++) {
    particleSystem.addParticle();
  }
}

// Resize canvas dynamically on window resize
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// Particle System Class
class ParticleSystem {
  constructor(particleCount, origin, textureImage) {
    this.particles = [];
    this.origin = origin.copy();
    this.img = textureImage;
    for (let i = 0; i < particleCount; i++) {
      this.particles.push(new Particle(this.origin, this.img));
    }
  }

  run() {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      let particle = this.particles[i];
      particle.run();
      if (particle.isDead()) {
        this.particles.splice(i, 1);
      }
    }
  }

  applyForce(dir) {
    for (let particle of this.particles) {
      particle.applyForce(dir);
    }
  }

  addParticle() {
    this.particles.push(new Particle(this.origin, this.img));
  }
}

// Particle Class
class Particle {
  constructor(pos, imageTexture) {
    this.loc = pos.copy();
    this.velocity = createVector(randomGaussian() * 0.3, randomGaussian() * 0.3 - 1.0);
    this.acceleration = createVector();
    this.lifespan = 100.0;
    this.texture = imageTexture;
    this.color = color(frameCount % 256, 255, 255);
  }

  run() {
    this.update();
    this.render();
  }

  render() {
    imageMode(CENTER);
    tint(this.color, this.lifespan);
    image(this.texture, this.loc.x, this.loc.y);
  }

  applyForce(f) {
    this.acceleration.add(f);
  }

  isDead() {
    return this.lifespan <= 0.0;
  }

  update() {
    this.velocity.add(this.acceleration);
    this.loc.add(this.velocity);
    this.lifespan -= 2.5;
    this.acceleration.mult(0);
  }
}