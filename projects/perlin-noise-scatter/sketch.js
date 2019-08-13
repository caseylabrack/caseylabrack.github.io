let agents = [];
let noiseScale = 100;
let noiseStrength = 1;
let hue = 0;

function setup() {
  let c = createCanvas(320, 320);
  c.parent("sketch")
  colorMode(HSB, 360, 100, 100, 1);
  textAlign(CENTER, CENTER);
  textSize(32);
  strokeWeight(4);
  
  hue = random(359)
  stroke(0, 0, 0);
}

function mouseReleased() {
  agents.forEach(a => a.speed = random(5, 10));
}

function touchEnded() {
  agents.forEach(a => a.speed = random(5, 10));
  return false;
}

function mousePressed() {
  hue += random(90,270)
  hue = hue % 360
  // stroke(hue, 50, 80)
  message = false;
  agents = [];
}

function touchStarted() {
  message = false;
  agents = [];
  return false;
}

function draw() {
  push()
  push()
  noFill()
  stroke(0,0,0)
  strokeWeight(2)
  rect(1,1,width-2,height-2)
  pop()
  blendMode(ADD)
  // blendMode(SCREEN)
  // blendMode(BLEND)
  fill(200, 0, 100, 0.1);
  rect(0,0,width,height);
  pop();
  
  if (mouseIsPressed) agents.push(new Agent(mouseX, mouseY));
  agents.forEach(z => z.update())
}

class Agent {
  constructor(x, y) {
    this.x = x + cos(random(0, TWO_PI)) * 25
    this.y = y + sin(random(0, TWO_PI)) * 25
    this.px = this.x;
    this.py = this.y;
    this.angle = 0;
    this.speed = random(0.25);
    this.direction = random(-0.5, 0.5);
  }

  release() {
    this.speed = random(5, 10);
  }

  update() {
    this.angle = (noise(this.x / noiseScale, this.y / noiseScale) - this.direction) * noiseStrength * TWO_PI;
    this.x += cos(this.angle) * this.speed;
    this.y += sin(this.angle) * this.speed;
    line(this.x, this.y, this.px, this.py);
    this.px = this.x;
    this.py = this.y;
  }
}