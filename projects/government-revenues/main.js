const svg = d3.select("figure").append("svg").attr("viewBox", "0 0 900 1500").attr("xmlns", "http://www.w3.org/2000/svg")
    .attr("width", 900).attr("height", 1500).lower(),
    margin = {top: 0, bottom: 120, left: 75, right: 20},
    width = svg.attr("width") - margin.left - margin.right,
    height = svg.attr("height") - margin.top - margin.bottom,
    chart = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`),
    x = d3.scaleBand().domain(d3.range(2001,2032+1,1)).range([0,width]).padding(0.1),
    y = d3.scaleBand().range([0, height]).padding(0.5).align(.5),
    color = d3.scaleDiverging().domain([-2.5,0,2.5]).interpolator(x => x==.5 ? "white" : d3.interpolatePiYG(x)) // force white on exact middle

d3.csv("data.csv").then(csv => {
    const data = csv.map(row => ({
        title: row["title"],
        year: +row["year"],
        value: +row["value"]
    }))

    // get list of unique law titles, set as y domain
    {
        let reverseTable = {}
        for (const row of data) {
            reverseTable[row.title] = true
        }
        y.domain(Object.keys(reverseTable))
    }

    chart.append("g")
        .selectAll("rect.chartcell")
        .data(data)
        .enter()
        .append("rect").classed("chartcell", true)
        .attr("x", d => x(d.year))
        .attr("y", d => y(d.title))
        .attr("width", x.bandwidth())
        .attr("height", y.bandwidth())
        .attr("fill", d => color(d.value))
            .on("mouseenter", function(_, d) {
                tooltip.text(d.value == 0 ? "0" : d.value.toFixed(1))
                    .attr("x", x(d.year) + x.bandwidth()/2)
                    .attr("y", y(d.title) + y.bandwidth()/2 + 1)
                    .attr("fill", Math.abs(d.value) > 1.25 ? "white" : "black")
            })
            .on("mouseleave", () => {
                tooltip.text("")
            })

    const tooltip = chart
        .append("text")
        .attr("class", "tooltip")
        .style("pointer-events", "none")
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "middle")

    labelsData = y.domain().map(law => {
        const lawData = data.filter(d => d.title == law)
        return {
            title: law,
            minYear: Math.min(...lawData.map(d => d.year)),
            maxYear: Math.max(...lawData.map(d => d.year))
        }
    })

    const lawLabels = chart.selectAll("text.labels")
        .data(labelsData)
        .enter()
        .append("text").classed("labels", true)
            .text(d => d.title)
            .attr("x", d => { 
                const center = (d.minYear + d.maxYear)/2
                return x(Math.floor(center)) + x.bandwidth()/2 + (center % 1) * x.bandwidth()
            })
            .attr("y", d => y(d.title) - 5)

    // use tspans to add footnote flags on three laws with technical names
    lawLabels
        .filter(d => d.title == "Patient Protection and Affordable Health Care Act" 
            || d.title == "Tax Cuts and Jobs Act, 2017" 
            || d.title == "Inflation Reduction Act, 2022")
        .append("tspan")
            .text((_,i) => " " + (i + 1))
            .attr("baseline-shift", "super")
            .attr("font-size", ".7em")

    chart.append("g").call(d3.axisBottom(x).tickValues(d3.range(2000,2030+1,5))).attr("transform", `translate(0, ${height})`)
    
    svg.append("text")
        .text("Fiscal year")
        .attr("x", (x.range()[0] + x.range()[1])/2)
        .attr("y", height+margin.top + 30)
        .style("text-anchor", "middle")
        .style("dominant-baseline", "hanging")
        .style("font-size", ".8em")

    // legend
    const legend = svg.append("g").attr("transform", `translate(5,${margin.top+height+60})`)
    const legendWidth = 200 
    const legendHeight = 20 
    const legendData = d3.range(-3,3+.01,1)
    const legendX = d3.scaleBand().domain(legendData).range([0,legendWidth])
    legend.selectAll("rect")
        .data(legendData)
        .enter()
        .append("rect").classed("chartcell", true)
            .attr("x", d => legendX(d))
            .attr("y", 10)
            .attr("width", legendX.bandwidth())
            .attr("height", legendHeight)
            .attr("fill", d => color(d))
    legend.append("g").call(d3.axisBottom(legendX)).attr("transform", `translate(0,${legendHeight+10})`)
    legend.append("text")
        .text("Change to revenues (as percentage of GDP)")
        .style("text-anchor", "left")
        .style("font-size", ".8em")
        .style("font-weight", 600)
    
    d3.selectAll(".domain").remove()
})