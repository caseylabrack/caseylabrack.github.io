let img, offset

function setup() {
  let c = createCanvas(320, 320);
  c.parent("sketch")
  img = loadImage('awesome.png')
  colorMode(HSB, 360, 100, 100, 1)
  imageMode(CENTER)
  strokeWeight(6)
  tint(0, 0, 100, 0.04)
}

function draw() {
  clear()

  offset = mouseIsPressed ? (frameCount % 12) * 4 : 0

  for (let i = -width - 48 + offset; i <= width; i += 12)
    line(i, 0, i + width, height)

  image(img, width / 2, height / 2)
}