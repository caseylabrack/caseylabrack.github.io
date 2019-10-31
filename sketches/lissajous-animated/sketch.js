let freqX, freqY, modx, mody

function setup() {
  createCanvas(320, 320).parent("canvas").mouseClicked(randomOne);
  colorMode(HSB, 360, 100, 100, 1)
  noFill()
  randomOne()

  const params = new URLSearchParams(window.location.search)

  if(params.get("fx") && params.get("fy") && params.get("mx") && params.get("my")) {
    freqX = params.get("fx")
    freqY = params.get("fy")
    modx = params.get("mx")
    mody = params.get("my")
    updateLink()
  } else {
    randomOne()
  }
}

function randomOne() {
  freqX = floor(random(1, 25))
  freqY = floor(random(1, 25))
  modx = floor(random(1, 25))
  mody = floor(random(1, 25))

  updateLink()
}

function updateLink () {
  const link = `https://caseylabrack.com/sketches/lissajous-animated/?fx=${freqX}&fy=${freqY}&mx=${modx}&my=${mody}`
  select("#permalink").html(link).attribute("href", link)
}

function addVert(i) {
  curveVertex(
    sin(i * freqX + radians(frameCount)) * cos(i * modx) * width/2,
    sin(i * freqY) * cos(i * mody) * height/2
  )
}

function draw() {
  clear()

  translate(width / 2, height / 2)
  beginShape()
  let i = 0
  addVert(i)
  for (i; i < TWO_PI; i += TWO_PI / 180) addVert(i)
  addVert(i)
  endShape()
}
