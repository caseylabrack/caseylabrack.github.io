let agents = [];
let noiseScale = 100;
let noiseStrength = 1;
let hue = 0;
let dark = false

function setup() {
  let c = createCanvas(320, 320);
  c.parent("sketch")
  colorMode(HSB, 360, 100, 100);
  strokeWeight(0.5)

  for (let i = 0; i < 250; i++)
    agents.push(new Agent(random(width), random(height)))

  newDraw()
}

function newDraw() {
  noiseSeed(random(99))

  hue += random(90, 270)
  hue = hue % 360
  stroke(hue, 50, 80, 0.1);

  push()
  if (dark) {
    blendMode(BLEND)
    fill(0, 0, 0)
  } else {
    noFill()
    clear()
  }
  strokeWeight(2)
  stroke(0, 0, 0)
  rect(1, 1, width - 2, height - 2)
  pop()

  blendMode(dark ? SCREEN : BURN)

  dark = floor(random(3)) == 0 ? true : false
}

function mouseClicked() {
  // document.getElementById("directions").style.display = "none"
  newDraw()
}

function draw() {
  agents.forEach(z => z.update())
}

class Agent {
  constructor(x, y) {
    this.x = x
    this.y = y
    this.px = this.x;
    this.py = this.y;
    this.angle = 0;
    this.speed = random(5, 10);
    this.direction = random(-0.5, 0.5);
  }

  update() {
    this.angle = noise(this.x / noiseScale, this.y / noiseScale) * noiseStrength * TWO_PI;
    this.x += cos(this.angle) * this.speed;
    this.y += sin(this.angle) * this.speed;

    line(this.x, this.y, this.px, this.py);

    if (this.x < 0 || this.x > width || this.y < 0 || this.y > height) {
      this.x = random(width)
      this.y = random(height)
    }

    this.px = this.x;
    this.py = this.y;
  }
}