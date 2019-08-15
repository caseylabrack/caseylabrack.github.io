let r
let rstep = 1
let tr = 250
let golden = 1.61803398875
let even = 13 / 8 //34 / 21
let a
let astep = golden
let rate = 50


function setup() {
  createCanvas(320, 320);
  colorMode(HSB, 360, 100, 100)
  noStroke()
}

function draw() {
  clear()

  if (cos(frameCount / rate % TWO_PI) > 0) {
    astep = easeInOutQuart(
      abs(sin(frameCount / rate % TWO_PI)),
      even, golden - even,
      1)
  }

  r = 1
  a = 0

  while (r < tr) {
    fill(floor(even * r % 8 % 1.0 / 0.125) * 360 / 8, 50, 90)
    circle(width / 2 + cos(a * TWO_PI) * r, height / 2 + sin(a * TWO_PI) * r, 8)
    r += rstep
    a += astep
  }
}

function easeInOutQuad(t, b, c, d) {
  if ((t /= d / 2) < 1) return c / 2 * t * t + b;
  return -c / 2 * ((--t) * (t - 2) - 1) + b;
}

function easeInOutQuart(t, b, c, d) {
  if ((t /= d / 2) < 1) return c / 2 * t * t * t * t + b;
  return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
}

function easeInOutExpo(t, b, c, d) {
  if (t == 0) return b;
  if (t == d) return b + c;
  if ((t /= d / 2) < 1) return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
  return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
}