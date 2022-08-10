const margin = {top: 30, bottom: 60, left: 60, right: 20},
      nwidth = 320, nheight = 400,
      width = nwidth - margin.left - margin.right,
      height = nheight - margin.top - margin.bottom

const factors = d3.scaleBand()
  .domain(["Income Before Transfers and Taxes",	"Means- Tested Transfers",	"Federal Taxes",	"Income After Transfers and Taxes"])
  .range([0,width])
  .padding(.2)

const income = d3.scaleLinear()
  .domain([0,350000])
  .range([height,0])

const incomeGroupNames = d3.scaleOrdinal()
  .domain(["all","lowest","second","middle","fourth","highest","p81_90","p91_95","p96_99","top1"])
  .range(["All Quintiles","Lowest Quintile","Second Quintile","Middle Quintile","Fourth Quintile","Highest Quintile","81st to 90th Percentiles","91st to 95th Percentiles","96th to 99th Percentiles","Top 1 Percent"])

const colors = d3.scaleOrdinal()
  .domain(factors.domain())
  .range([d3.hcl(180,60,60), d3.hcl(90,60,60), d3.hcl(60,60,60), d3.hcl(180,60,40)])

d3.select(".beforeLabel").style("color", colors("Income Before Transfers and Taxes"))
d3.select(".transfersLabel").style("color", colors("Means- Tested Transfers"))
d3.select(".taxesLabel").style("color", colors("Federal Taxes"))
d3.select(".afterLabel").style("color", colors("Income After Transfers and Taxes"))

// https://bl.ocks.org/mbostock/7555321
function wrap(text, width) {
  text.each(function() {
    var text = d3.select(this),
        words = text.text().split(/\s+/).reverse(),
        word,
        line = [],
        lineNumber = 0,
        lineHeight = 1.1, // ems
        y = text.attr("y"),
        dy = parseFloat(text.attr("dy")),
        tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
    while (word = words.pop()) {
      line.push(word);
      tspan.text(line.join(" "));
      if (tspan.node().getComputedTextLength() > width) {
        line.pop();
        tspan.text(line.join(" "));
        line = [word];
        tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
      }
    }
  });
}

d3.queue()
.defer(d3.csv, "income.csv")
.awaitAll(function(error,[data]) {

  const update = () => {

    const year = d3.select("#btns #year").property("value")
    const incomeGroups = d3.select("#incomeGroups").selectAll("input").nodes().filter(z => z.checked).map(z => z.name)
    const d = data.filter(z => z.Year == year && incomeGroups.includes(z.quintile))

    const selection = d3.select("#charts").selectAll("svg")
      .data(d, d => d["quintile"])

    const enteringSVG = selection
      .enter().append("svg")
        .attr("width", nwidth).attr("height", nheight).style("display", "inline-block")
        .style("opacity", .25)
    enteringSVG.transition().style("opacity", 1)

    const entering = enteringSVG
      .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`)
        .attr("shape-rendering", "crispEdges")

    entering.append("g").call(d3.axisBottom(factors).tickSize(0).tickPadding(6)).attr("transform", `translate(0, ${height})`).selectAll(".tick text").call(wrap, 60)

    let max = d
      .map(row => +row["Income Before Transfers and Taxes"]+ +row["Means- Tested Transfers"]) //highest value for each row is after means tested transfer
      .reduce((acc, inc) => inc > acc ? inc : acc) // highest value
    max = Math.ceil(max / 10000) * 10000 // round up to nearest 10-thousand
    income.domain([0,max])
    entering.append("g").classed("yaxis", true).call(d3.axisLeft(income).ticks(5))
    selection.select("g.yaxis").transition().call(d3.axisLeft(income).ticks(5))

    enteringSVG.append("text").classed("incomeGroupName", true)
      .text(d => incomeGroupNames(d["quintile"]).toLowerCase())
      .attr("x", (nwidth - margin.left)/2 + margin.left).attr("y", 25).style("text-anchor", "middle")
      .style("font-size", ".9em").style("font-variant", "small-caps")
    selection.select("text.incomeGroupName").text(d => incomeGroupNames(d["quintile"]).toLowerCase())

    entering.append("rect").classed("before", true)
      .attr("x", d => factors("Income Before Transfers and Taxes"))
      .attr("width", factors.bandwidth())
      .attr("y", d => income(+d["Income Before Transfers and Taxes"]))
      .attr("height", d => income(0) - income(+d["Income Before Transfers and Taxes"]))
      .style("fill", colors("Income Before Transfers and Taxes"))
    selection.select("g").select("rect.before")
      .transition()
        .attr("y", d => income(+d["Income Before Transfers and Taxes"]))
        .attr("height", d => income(0) - income(+d["Income Before Transfers and Taxes"]))

    entering.append("line").classed("before-transfers leg", true)
      .attr("x1", d => factors("Income Before Transfers and Taxes") + factors.bandwidth())
      .attr("x2", d => factors("Means- Tested Transfers"))
      .attr("y1", d => income(+d["Income Before Transfers and Taxes"])).attr("y2", d => income(+d["Income Before Transfers and Taxes"]))
    selection.select("line.before-transfers")
      .transition()
      .attr("y1", d => income(+d["Income Before Transfers and Taxes"])).attr("y2", d => income(+d["Income Before Transfers and Taxes"]))

    entering.append("rect").classed("transfers", true)
      .attr("x", d => factors("Means- Tested Transfers"))
      .attr("width", factors.bandwidth())
      .attr("y", d => income(+d["Income Before Transfers and Taxes"] + +d["Means- Tested Transfers"]))
      .attr("height", d => Math.max(2, income(0) - income(+d["Means- Tested Transfers"])))
      .style("fill", colors("Means- Tested Transfers"))
    selection.select("g").select("rect.transfers")
      .transition()
      .attr("y", d => income(+d["Income Before Transfers and Taxes"] + +d["Means- Tested Transfers"]))
      .attr("height", d => Math.max(2, income(0) - income(+d["Means- Tested Transfers"])))

    entering.append("line").classed("transfers-taxes leg", true)
      .attr("x1", d => factors("Means- Tested Transfers") + factors.bandwidth())
      .attr("x2", d => factors("Federal Taxes"))
      .attr("y1", d => income(+d["Income Before Transfers and Taxes"] + +d["Means- Tested Transfers"])).attr("y2", d => income(+d["Income Before Transfers and Taxes"] + +d["Means- Tested Transfers"]))
    selection.select("line.transfers-taxes")
      .transition()
      .attr("y1", d => income(+d["Income Before Transfers and Taxes"] + +d["Means- Tested Transfers"])).attr("y2", d => income(+d["Income Before Transfers and Taxes"] + +d["Means- Tested Transfers"]))

    entering.append("rect").classed("taxes", true)
      .attr("x", d => factors("Federal Taxes"))
      .attr("width", factors.bandwidth())
      .attr("y", d => income(+d["Income Before Transfers and Taxes"] + +d["Means- Tested Transfers"]))
      .attr("height", d => Math.max(2, income(0) - income(+d["Federal Taxes"])))
      .style("fill", colors("Federal Taxes"))
    selection.select("g").select("rect.taxes")
      .transition()
      .attr("y", d => income(+d["Income Before Transfers and Taxes"] + +d["Means- Tested Transfers"]))
      .attr("height", d => Math.max(2, income(0) - income(+d["Federal Taxes"])))

    entering.append("line").classed("taxes-after leg", true)
      .attr("x1", d => factors("Federal Taxes") + factors.bandwidth())
      .attr("x2", d => factors("Income After Transfers and Taxes"))
      .attr("y1", d => income(+d["Income After Transfers and Taxes"])).attr("y2", d => income(+d["Income After Transfers and Taxes"]))
    selection.select("line.taxes-after")
      .transition()
      .attr("y1", d => income(+d["Income After Transfers and Taxes"])).attr("y2", d => income(+d["Income After Transfers and Taxes"]))

    entering.append("rect").classed("after", true)
      .attr("x", d => factors("Income After Transfers and Taxes"))
      .attr("width", factors.bandwidth())
      .attr("y", d => income(+d["Income After Transfers and Taxes"]))
      .attr("height", d => income(0) - income(+d["Income After Transfers and Taxes"]))
      .style("fill", colors("Income After Transfers and Taxes"))
    selection.select("g").select("rect.after")
      .transition()
      .attr("y", d => income(+d["Income After Transfers and Taxes"]))
      .attr("height", d => income(0) - income(+d["Income After Transfers and Taxes"]))

    selection.exit().transition().style("opacity",0).remove()
  }

  update()

  d3.select("#btns #year").on("change", function () { d3.select("#yearLabel").html(this.value); update(); })
  d3.select("#incomeGroups").on("change", update)
})
