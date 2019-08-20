let p, c, i

function setup() {
  createCanvas(320, 320).parent("canvas").mouseClicked(randomOne);
  selectAll('.inputs').forEach(z => z.changed(update))
  colorMode(HSB, 360, 100, 100, 1)

  const params = new URLSearchParams(window.location.search)

  if(params.get("fx") && params.get("fy") && params.get("mx") && params.get("my") && params.get("phi") && params.get("r")) {
    select("#fx").value(params.get("fx"))
    select("#fy").value(params.get("fy"))
    select("#mx").value(params.get("mx"))
    select("#my").value(params.get("my"))
    select("#phi").value(params.get("phi"))
    select("#res").checked(params.get("r")==10 ? true : false)
    update()
  } else {
    randomOne()
  }

  noFill()
}

function update() {

  p = ljpoints(width / 2, height / 2,
                select("#fx").value(), select("#fy").value(),
                select("#mx").value(), select("#my").value(),
                select("#phi").value(), select("#res").checked() ? 10 : 1
              )
  c = select("#res").checked() ? 200 : 5000

  const link = `https://CaseyLabrack.com/sketches/lissajous-figures/index.html?`
           + `fx=${select("#fx").value()}` + `&fy=${select("#fy").value()}`
           + `&mx=${select("#mx").value()}` + `&my=${select("#my").value()}`
           + `&phi=${select("#phi").value()}` + `&r=${select("#res").checked() ? 10 : 1}`

  select("#permalink").html(link).attribute("href", link)

  clear()
  i = 0
  loop()
}

function randomOne() {
  select("#fx").value(floor(random(1, 25)))
  select("#fy").value(floor(random(1, 25)))
  select("#mx").value(floor(random(1, 25)))
  select("#my").value(floor(random(1, 25)))
  select("#phi").value(random(359))
  update()
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

  translate(width / 2, height / 2)
  let d = 0
  let r = i + 100
  for (i; i < r; i++) {
    for (let j = 0; j < i; j++) {
      d = (p[i].x - p[j].x) * (p[i].x - p[j].x) + (p[i].y - p[j].y) * (p[i].y - p[j].y) // fast squared dist
      if (d < c) {
        push()
        stroke(0, 0, 0, pow(1 - d/c, 6))
        line(p[i].x, p[i].y, p[j].x, p[j].y)
        pop()
      }
    }
    if(i==p.length-1) {
      noLoop()
      break;
    }
  }
}
