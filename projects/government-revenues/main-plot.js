d3.csv("data.csv").then(csv => {
    let data = csv
        .map(row => 
            ({
                title: row["title"],
                year: +row["year"],
                value: +row["value"]
            })
        )
        .filter(d => d.year > 2024-25) // last 25 years

    // a second table based on the first but for direct labelling series
    // for each unique law in the table, create an object with the first and last year of effect
    let extents = [];
    {
        for (const row of data) {
            const idx = extents.findIndex(z => z.title==row.title);
            if(idx==-1) {
               extents.push({title: row.title, minYear: row.year, maxYear: row.year})
            } else {
               extents[idx].minYear = Math.min(extents[idx].minYear, row.year);
               extents[idx].maxYear = Math.max(extents[idx].maxYear, row.year);
            }
          }
    }

    const plot = Plot.plot({
    marginLeft: 300,
    marginBottom: 50,
    width: 700,//Math.max(700, width),
    height: 1000,
    y: { axis: null, innerpadding: 100 },
    x: {
      ticks: [1982, 1990, 2000, 2010, 2020, 2030],
      tickFormat: (d) => d.toString(),
      label: "Fiscal year"
    },
    color: {
      type: "diverging",
      scheme: "PiYG", //"PRGn",
      legend: true,
      label: "Change to revenues (as percentage of GDP)"
    },
    marks: [
      Plot.rect(data, {
        x: "year",
        y: "title",
        stroke: d3.hcl(0, 0, 20).hex(),
        strokeWidth: 0.25,
        fill: "value",
        sort: { y: null }
      }),
      Plot.rect(data.filter(z => z.value == 0), {
        x: "year",
        y: "title",
        stroke: d3.hcl(0, 0, 20).hex(),
        strokeWidth: 0.25,
        fill: "white",
        sort: { y: null }
      }),
      Plot.text(
        extents,
        {
          x: "minYear",
          y: "title",
          text: "title",
          textAnchor: "end",
          href: d => "http://www.google.com",
          dx: -24
        }
      ),
      Plot.tip(
        data,
        Plot.pointerX({ x: "year", y: "title", title: "value" })
      )
    ]
  })

    console.log(data)
    // const p1 = Plot.rectY({length: 10000}, Plot.binX({y: "count"}, {x: Math.random})).plot();
    const div = document.querySelector("#myplot");
    div.append(plot);
})
