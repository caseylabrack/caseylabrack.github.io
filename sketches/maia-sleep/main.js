const svg = d3.select("body").append("svg").attr("width", innerWidth).attr("height", 700),
      margin = {top: 30, bottom: 20, left: 20, right: 20},
      width = svg.attr("width") - margin.left - margin.right,
      height = svg.attr("height") - margin.top - margin.bottom,
      chart = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`)
      x = d3.scaleLinear().domain([0,24]).range([0, width]),
      y = d3.scaleLinear().range([0,height]),
      symbol = d3.scaleOrdinal().domain(["Feed","Pump","Diaper"]).range(["🍼","🐄","💩"]),
      color = d3.scaleOrdinal().domain(["Feed","Pump","Diaper"]).range([d3.hcl(270,50,60),d3.hcl(320,50,60),d3.hcl(30,50,40)])

const line = d3.line()
              .x(d => x((+d["time"] + 12) % 24)) // shift time scale so midnight is the middle value
              .y(d => y(+d["dayNumber"]))

const timeFormat = d => {
  if (d==12) return "midnight"
  if (d==0) return "noon"
  if (d==6) return "6 p.m."
  if (d==18) return "6 a.m."
  // const adjusted = d - 12 //Math.abs((d-12) % 24)
  // const am = adjusted < 12
  // return adjusted + " " + (am ? "a.m" : "p.m.")
}

d3.queue()
.defer(d3.csv, "baby-data.csv")
.defer(d3.csv, "sunrises.csv")
.defer(d3.csv, "sunsets.csv")
.awaitAll(function(error,[babyData,sunriseData,sunsetData]) {

    d3.selectAll(".diaper").style("color", color("Diaper"))
    d3.selectAll(".pump").style("color", color("Pump"))
    d3.selectAll(".feed").style("color", color("Feed"))

    y.domain([0, d3.max(babyData, d=> +d["dayNumber"])])

    chart.append("g").call(d3.axisBottom(x).tickValues([0,6,12,18]).tickFormat(timeFormat)).attr("transform", `translate(0, ${height})`)
    chart.append("g").call(d3.axisLeft(y))

    // chart.append("g").selectAll("circle")
    //   .data(babyData)
    //   .enter().append("circle")
    //     .attr("cx", d => x(d["adjustedTime"]))
    //     .attr("cy", d => y(d["dayNumber"]))
    //     .attr("r", 4)
    //     .style("fill", "red")
    //     .style("opacity", .2)

    chart.append("g").selectAll("text")
      .data(babyData)
      .enter().append("text")
        .text(d => symbol(d["Type"]))
        .attr("x", d => x((+d["time"] + 12) % 24)) // shift time scale so midnight is the middle value
        .attr("y", d => y(d["dayNumber"])+4)
        .attr("text-anchor", "middle")
        .attr("font-family", "Noto Emoji")
        .attr("font-size", "20")
        .style("fill", d => color(d["Type"]))
        .style("opacity", .5)

    chart.append("g").append("path")
      .datum(sunriseData)
      .attr("d", line)
      .style("stroke", d3.hcl(0,0,25)).style("stroke-dasharray","8 2").style("fill", "none")

    chart.append("g").append("path")
      .datum(sunsetData)
      .attr("d", line)
      .style("stroke", d3.hcl(0,0,25)).style("stroke-dasharray","8 2").style("fill", "none")

    svg.append("text").text("Day").attr("x", 0).attr("y", 16).style("font-size", ".9em")
    chart.append("text").text("SUNRISE").attr("x", x((+sunriseData[0]["time"] + 12) % 24)).attr("y", y(0)-4).style("fill","black").style("text-anchor", "middle").style("font-size", ".6em").attr("font-family", "sans-serif")
    chart.append("text").text("SUNSET").attr("x", x((+sunsetData[0]["time"] + 12) % 24)).attr("y", y(0)-4).style("fill","black").style("text-anchor", "middle").style("font-size", ".6em").attr("font-family", "sans-serif")
})
