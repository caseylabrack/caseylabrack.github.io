let p
let c = 25

function setup() {
  createCanvas(400, 400).parent("canvas").mouseClicked(randomOne);
  selectAll('.inputs').forEach(z => z.changed(update))
  colorMode(HSB, 360, 100, 100, 1)

  const params = new URLSearchParams(window.location.search)

  // print(params.get("fx") , params.get("fy") , params.get("mx") , params.get("my") , params.get("phi") , params.get("r"))

  if(params.get("fx") && params.get("fy") && params.get("mx") && params.get("my") && params.get("phi") && params.get("r")) {
    p = ljpoints(width / 2, height / 2,
                 params.get("fx"), params.get("fy"),
                 params.get("mx"), params.get("my"),
                 params.get("phi"), params.get("r")
                )
    select("#fx").value(params.get("fx"))
    select("#fy").value(params.get("fy"))
    select("#mx").value(params.get("mx"))
    select("#my").value(params.get("my"))
    select("#phi").value(params.get("phi"))
    select("#res").checked(params.get("r")==10 ? true : false)
    c = params.get("r")==10 ? 25 : 100
    permalinkOut()
  } else {
    randomOne()
    print("random one")
  }

  noFill()
  noLoop()
}

function update() {

  p = ljpoints(width / 2, height / 2,
                select("#fx").value(), select("#fy").value(),
                select("#mx").value(), select("#my").value(),
                select("#phi").value(), select("#res").checked() ? 10 : 1
              )
  c = select("#res").checked() ? 25 : 100
  redraw()
  permalinkOut()
}

function permalinkOut () {
  const link = `https://www.CaseyLabrack.com/sketches/lissajous-figures/index.html?`
           + `fx=${select("#fx").value()}` + `&fy=${select("#fy").value()}`
           + `&mx=${select("#mx").value()}` + `&my=${select("#my").value()}`
           + `&phi=${select("#phi").value()}` + `&r=${select("#res").checked() ? 10 : 1}`

  select("#permalink").html(link).attribute("href", link)
}

function randomOne() {
  let freqX = floor(random(1, 25))
  select("#fx").value(freqX)
  let freqY = floor(random(1, 25))
  select("#fy").value(freqY)
  let modx = floor(random(1, 25))
  select("#mx").value(modx)
  let mody = floor(random(1, 25))
  select("#my").value(mody)
  let phi = random(359)
  select("#phi").value(phi)
  let r = select("#res").checked() ? 10 : 1
  c = select("#res").checked() ? 25 : 100
  p = ljpoints(width / 2, height / 2,
               freqX, freqY,
               modx, mody,
               phi, r
              )
  permalinkOut()
  redraw()
}

function ljpoints(sx, sy, fx, fy, mx, my, p = 0, r = 1) {

  let points = []

  for (let i = 0; i < TWO_PI; i += TWO_PI / (360 * r)) {
    points.push(
      createVector(
        sin(i * fx + radians(p)) * cos(i * mx) * sx,
        sin(i * fy) * cos(i * my) * sy
      )
    )
  }

  return points
}

function draw() {
  clear()

  translate(width / 2, height / 2)
  let d = 0
  let a = 0
  for (let i = 0; i < p.length; i++) {
    for (let j = 0; j < i; j++) {
      d = p[i].dist(p[j])
      if (d < c) {
        a = pow(lerp(1, 0, d / c), 4)
        push()
        stroke(0, 0, 0, a)
        line(p[i].x, p[i].y, p[j].x, p[j].y)
        pop()
      }
    }
  }
}
