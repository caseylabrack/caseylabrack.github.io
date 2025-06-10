// to do: 
// download jpeg?
// sticky sidebar https://dev.to/clairecodes/how-to-make-a-sticky-sidebar-with-two-lines-of-css-2ki7

const trace = x => {console.log(x); return x}
const decileKeys = ["d1","d2","d3","d4","d5","d6","d7","d8","d9","d10","all"]
const decileKeysNoAll = ["d1","d2","d3","d4","d5","d6","d7","d8","d9","d10"]
const formatNominalChangeNumbers = d3.format(".1f")

const marketIncome = data => user => {
    let rows = []
    for(const dec of decileKeys) {
        let sum = data
            .filter(row => user.years.includes(row.year))
            .filter(row => row.series == "Average Market Income (2025 Dollars)")
            .reduce((acc, inc) => inc[dec] + acc, 0)
        rows.push(sum / user.years.length)
    }
    return rows
}

const socialInsurance = data => user => {
    let rows = []
    for(const dec of decileKeys) {
        let sum = data
            .filter(row => user.years.includes(row.year))
            .filter(row => row.series == "Social Insurance Benefits (2025 Dollars)")
            .reduce((acc, inc) => inc[dec] + acc, 0)
        rows.push(sum / user.years.length)
    }
    return rows
}

const meansTested = data => user => {
    let rows = []
    for(const dec of decileKeys) {
        let sum = data
            .filter(row => user.years.includes(row.year))
            .filter(row => row.series == "Means Tested Transfers (2025 Dollars)")
            .reduce((acc, inc) => inc[dec] + acc, 0)
        rows.push(sum / user.years.length)
    }
    return rows
}

const federalTaxes = data => user => {
    let rows = []
    for(const dec of decileKeys) {
        let sum = data
            .filter(row => user.years.includes(row.year))
            .filter(row => row.series == "Federal Taxes (2025 Dollars)")
            .reduce((acc, inc) => inc[dec] + acc, 0)
        rows.push(sum / user.years.length)
    }
    return rows
}

const incomeAfter = data => user => {
    let rows = []
    for(const dec of decileKeys) {
        let sum = data
            .filter(row => user.years.includes(row.year))
            .filter(row => row.series == "Income After Transfers and Taxes (2025 Dollars)")
            .reduce((acc, inc) => inc[dec] + acc, 0)
        rows.push(sum / user.years.length)
    }
    return rows
}

const nominal = data => user => {
    let rows = []
    for(const dec of decileKeys) {
        let sum = 0
        sum += data
            .filter(row => user.years.includes(row.year))
            .filter(row => row.factor == "Federal Taxes and Cash Transfers")
            .filter(row => row.series == "Total Nominal Change (Billions of dollars)")
            .reduce((acc, inc) => inc[dec] + acc, 0) * user.federalTaxesAndCashTransfers
        sum += data
            .filter(row => user.years.includes(row.year))
            .filter(row => row.factor == "Federal and State In-Kind Transfers")
            .filter(row => row.series == "Total Nominal Change (Billions of dollars)")
            .reduce((acc, inc) => inc[dec] + acc, 0) * user.inkind
        sum += data
            .filter(row => user.years.includes(row.year))
            .filter(row => row.factor == "Other Spending Changes by States in Response to In-Kind Transfers")
            .filter(row => row.series == "Total Nominal Change (Billions of dollars)")
            .reduce((acc, inc) => inc[dec] + acc, 0) * user.stateFinance
        sum += data
            .filter(row => user.years.includes(row.year))
            .filter(row => row.factor == "Tax Changes by States in Response to In-Kind Transfers")
            .filter(row => row.series == "Total Nominal Change (Billions of dollars)")
            .reduce((acc, inc) => inc[dec] + acc, 0) * user.stateFinance
        sum += data
            .filter(row => user.years.includes(row.year))
            .filter(row => row.factor == "Public Goods Allocated Per Person")
            .filter(row => row.series == "Total Nominal Change (Billions of dollars)")
            .reduce((acc, inc) => inc[dec] + acc, 0) * user.publicGoods * user.publicGoodsRatio
        sum += data
            .filter(row => user.years.includes(row.year))
            .filter(row => row.factor == "Public Goods Allocated as a Percentage of Income")
            .filter(row => row.series == "Total Nominal Change (Billions of dollars)")
            .reduce((acc, inc) => inc[dec] + acc, 0) * user.publicGoods * (1 - user.publicGoodsRatio)
        rows.push(sum / user.years.length)
    }
    return rows
}

const realChange = data => user => {
    let rows = []
    for(const dec of decileKeys) {
        let sum = 0
        sum += data
            .filter(row => user.years.includes(row.year))
            .filter(row => row.factor == "Federal Taxes and Cash Transfers")
            .filter(row => row.series == "Total Change (Billions of 2025 Dollars)")
            .reduce((acc, inc) => inc[dec] + acc, 0) * user.federalTaxesAndCashTransfers
        sum += data
            .filter(row => user.years.includes(row.year))
            .filter(row => row.factor == "Federal and State In-Kind Transfers")
            .filter(row => row.series == "Total Change (Billions of 2025 Dollars)")
            .reduce((acc, inc) => inc[dec] + acc, 0) * user.inkind
        sum += data
            .filter(row => user.years.includes(row.year))
            .filter(row => row.factor == "Other Spending Changes by States in Response to In-Kind Transfers")
            .filter(row => row.series == "Total Change (Billions of 2025 Dollars)")
            .reduce((acc, inc) => inc[dec] + acc, 0) * user.stateFinance
        sum += data
            .filter(row => user.years.includes(row.year))
            .filter(row => row.factor == "Tax Changes by States in Response to In-Kind Transfers")
            .filter(row => row.series == "Total Change (Billions of 2025 Dollars)")
            .reduce((acc, inc) => inc[dec] + acc, 0) * user.stateFinance
        sum += data
            .filter(row => user.years.includes(row.year))
            .filter(row => row.factor == "Public Goods Allocated Per Person")
            .filter(row => row.series == "Total Change (Billions of 2025 Dollars)")
            .reduce((acc, inc) => inc[dec] + acc, 0) * user.publicGoods * user.publicGoodsRatio
        sum += data
            .filter(row => user.years.includes(row.year))
            .filter(row => row.factor == "Public Goods Allocated as a Percentage of Income")
            .filter(row => row.series == "Total Change (Billions of 2025 Dollars)")
            .reduce((acc, inc) => inc[dec] + acc, 0) * user.publicGoods * (1 - user.publicGoodsRatio)
        rows.push(sum / user.years.length)
    }
    return rows
}

const formatBaselineAnnual = d3.format(",.0f")
const baselineAnnual = data => user => {
    let rows = []
    for(const dec of decileKeys) {
        let sum = data
            .filter(row => user.years.includes(row.year))
            .filter(row => row.factor == "Federal Taxes and Cash Transfers")
            .filter(row => row.series == "Baseline Annual Average (2026 dollars)")
            .reduce((acc, inc) => inc[dec] + acc, 0) * user.federalTaxesAndCashTransfers
        rows.push(sum / user.years.length)
    }
    return rows
}
const annualAverage = data => user => {
    let rows = []
    for(const dec of decileKeys) {
        let sum = 0
        sum += data
            .filter(row => user.years.includes(row.year))
            .filter(row => row.factor == "Federal Taxes and Cash Transfers")
            .filter(row => row.series == "Annual Average Change (2026 dollars)")
            .reduce((acc, inc) => inc[dec] + acc, 0) * user.federalTaxesAndCashTransfers
        sum += data
            .filter(row => user.years.includes(row.year))
            .filter(row => row.factor == "Federal and State In-Kind Transfers")
            .filter(row => row.series == "Annual Average Change (2026 dollars)")
            .reduce((acc, inc) => inc[dec] + acc, 0) * user.inkind
        sum += data
            .filter(row => user.years.includes(row.year))
            .filter(row => row.factor == "Other Spending Changes by States in Response to In-Kind Transfers")
            .filter(row => row.series == "Annual Average Change (2026 dollars)")
            .reduce((acc, inc) => inc[dec] + acc, 0) * user.stateFinance
        sum += data
            .filter(row => user.years.includes(row.year))
            .filter(row => row.factor == "Tax Changes by States in Response to In-Kind Transfers")
            .filter(row => row.series == "Annual Average Change (2026 dollars)")
            .reduce((acc, inc) => inc[dec] + acc, 0) * user.stateFinance
        sum += data
            .filter(row => user.years.includes(row.year))
            .filter(row => row.factor == "Public Goods Allocated Per Person")
            .filter(row => row.series == "Annual Average Change (2026 dollars)")
            .reduce((acc, inc) => inc[dec] + acc, 0) * user.publicGoods * user.publicGoodsRatio
        sum += data
            .filter(row => user.years.includes(row.year))
            .filter(row => row.factor == "Public Goods Allocated as a Percentage of Income")
            .filter(row => row.series == "Annual Average Change (2026 dollars)")
            .reduce((acc, inc) => inc[dec] + acc, 0) * user.publicGoods * (1 - user.publicGoodsRatio)
        rows.push(sum / user.years.length)
    }
    return rows
}

// const formatShareOfChange = d3.format(".1%")
const formatShareOfChange = x => (x * 100).toFixed(1)
const shareOfChange = nomRow => {
    let rows = []
    const all = nomRow[nomRow.length - 1]
    for(let i = 0; i < nomRow.length; i++) {
        rows.push(nomRow[i]/all)
    }
    return rows
}
const changeInDollars = data => user => {
    let rows = []
    for(const dec of decileKeys) {
        let sum = 0
        sum += data
            .filter(row => user.years.includes(row.year))
            .filter(row => row.factor == "Federal Taxes and Cash Transfers")
            .filter(row => row.series == "Percentage Change in 2026 Dollars of Household Income")
            .reduce((acc, inc) => inc[dec] + acc, 0) * user.federalTaxesAndCashTransfers
        sum += data
            .filter(row => user.years.includes(row.year))
            .filter(row => row.factor == "Federal and State In-Kind Transfers")
            .filter(row => row.series == "Percentage Change in 2026 Dollars of Household Income")
            .reduce((acc, inc) => inc[dec] + acc, 0) * user.inkind
        sum += data
            .filter(row => user.years.includes(row.year))
            .filter(row => row.factor == "Other Spending Changes by States in Response to In-Kind Transfers")
            .filter(row => row.series == "Percentage Change in 2026 Dollars of Household Income")
            .reduce((acc, inc) => inc[dec] + acc, 0) * user.stateFinance
        sum += data
            .filter(row => user.years.includes(row.year))
            .filter(row => row.factor == "Tax Changes by States in Response to In-Kind Transfers")
            .filter(row => row.series == "Percentage Change in 2026 Dollars of Household Income")
            .reduce((acc, inc) => inc[dec] + acc, 0) * user.stateFinance
        sum += data
            .filter(row => user.years.includes(row.year))
            .filter(row => row.factor == "Public Goods Allocated Per Person")
            .filter(row => row.series == "Percentage Change in 2026 Dollars of Household Income")
            .reduce((acc, inc) => inc[dec] + acc, 0) * user.publicGoods * user.publicGoodsRatio
        sum += data
            .filter(row => user.years.includes(row.year))
            .filter(row => row.factor == "Public Goods Allocated as a Percentage of Income")
            .filter(row => row.series == "Percentage Change in 2026 Dollars of Household Income")
            .reduce((acc, inc) => inc[dec] + acc, 0) * user.publicGoods * (1 - user.publicGoodsRatio)
        rows.push(sum / user.years.length)
    }
    return rows
}

const fedTaxesAndCashTransfersDollars = data => user => { // P24: =B22*$B$3
    let row = []
    for(const dec of decileKeysNoAll) { // [Lowest, 1st, 2nd, ...]
        let sum = data
            .filter(row => user.years.includes(row.year))
            .filter(row => row.factor == "Federal Taxes and Cash Transfers")
            .filter(row => row.series == "Annual Average Change (2026 dollars)")
            .reduce((acc, inc) => inc[dec] + acc, 0)
        
        row.push(sum / user.years.length * user.federalTaxesAndCashTransfers)
    }
    return row // whole series
}

const federalStateInKindDollars = data => user => { // P25: =B29*$B$4
    let row = []
    for(const dec of decileKeysNoAll) { // [Lowest, 1st, 2nd, ...]
        let sum = data
            .filter(row => user.years.includes(row.year))
            .filter(row => row.factor == "Federal and State In-Kind Transfers")
            .filter(row => row.series == "Annual Average Change (2026 dollars)")
            .reduce((acc, inc) => inc[dec] + acc, 0)
        
        row.push(sum / user.years.length * user.inkind)
    }
    return row // whole series
}

const stateFinancingDollars = data => user => { // P26: =B29*$B$4
    let row = []
    for(const dec of decileKeysNoAll) { // [Lowest, 1st, 2nd, ...]
        let sum = 
        data
            .filter(row => user.years.includes(row.year))
            .filter(row => row.factor == "Other Spending Changes by States in Response to In-Kind Transfers")
            .filter(row => row.series == "Annual Average Change (2026 dollars)")
            .reduce((acc, inc) => inc[dec] + acc, 0) +
        data
            .filter(row => user.years.includes(row.year))
            .filter(row => row.factor == "Tax Changes by States in Response to In-Kind Transfers")
            .filter(row => row.series == "Annual Average Change (2026 dollars)")
            .reduce((acc, inc) => inc[dec] + acc, 0) 
        
        row.push((sum / user.years.length) * user.stateFinance)
    }
    return row // whole series
}

const publicGoodsDollars = data => user => { // P24: =B22*$B$3
    let row = []
    for(const dec of decileKeysNoAll) { // [Lowest, 1st, 2nd, ...]
        let sum = 
        data
            .filter(row => user.years.includes(row.year))
            .filter(row => row.factor == "Public Goods Allocated as a Percentage of Income")
            .filter(row => row.series == "Annual Average Change (2026 dollars)")
            .reduce((acc, inc) => inc[dec] + acc, 0) * (1 - user.publicGoodsRatio) +
        data
            .filter(row => user.years.includes(row.year))
            .filter(row => row.factor == "Public Goods Allocated Per Person")
            .filter(row => row.series == "Annual Average Change (2026 dollars)")
            .reduce((acc, inc) => inc[dec] + acc, 0) * user.publicGoodsRatio

        row.push(sum / user.years.length * user.publicGoods)
    }
    return row // whole series
}

const fedTaxesAndCashTransfersPCT = data => user => { // P32: =B24*$B$3
    let row = []
    for(const dec of decileKeysNoAll) { // [Lowest, 1st, 2nd, ...]
        let sum = data
            .filter(row => user.years.includes(row.year))
            .filter(row => row.factor == "Federal Taxes and Cash Transfers")
            .filter(row => row.series == "Percentage Change in 2026 Dollars of Household Income")
            .reduce((acc, inc) => inc[dec] + acc, 0)

        row.push(sum / user.years.length * user.federalTaxesAndCashTransfers)
    }
    return row // whole series
}

const federalStateInKindPCT = data => user => { 
    let row = []
    for(const dec of decileKeysNoAll) { // [Lowest, 1st, 2nd, ...]
        let sum = data
            .filter(row => user.years.includes(row.year))
            .filter(row => row.factor == "Federal and State In-Kind Transfers")
            .filter(row => row.series == "Percentage Change in 2026 Dollars of Household Income")
            .reduce((acc, inc) => inc[dec] + acc, 0)

        row.push(sum / user.years.length * user.inkind)
    }
    return row // whole series
}

const stateFinancingPCT = data => user => { 
    let row = []
    for(const dec of decileKeysNoAll) { // [Lowest, 1st, 2nd, ...]
        let sum = 
        data
            .filter(row => user.years.includes(row.year))
            .filter(row => row.factor == "Other Spending Changes by States in Response to In-Kind Transfers")
            .filter(row => row.series == "Percentage Change in 2026 Dollars of Household Income")
            .reduce((acc, inc) => inc[dec] + acc, 0) +
        data
            .filter(row => user.years.includes(row.year))
            .filter(row => row.factor == "Tax Changes by States in Response to In-Kind Transfers")
            .filter(row => row.series == "Percentage Change in 2026 Dollars of Household Income")
            .reduce((acc, inc) => inc[dec] + acc, 0) 

        row.push(sum / user.years.length * user.stateFinance)
    }
    return row // whole series
}

const publicGoodsPCT = data => user => { 
    let row = []
    for(const dec of decileKeysNoAll) { // [Lowest, 1st, 2nd, ...]
        let sum = 
        data
            .filter(row => user.years.includes(row.year))
            .filter(row => row.factor == "Public Goods Allocated as a Percentage of Income")
            .filter(row => row.series == "Percentage Change in 2026 Dollars of Household Income")
            .reduce((acc, inc) => inc[dec] + acc, 0) * (1 - user.publicGoodsRatio) +
        data
            .filter(row => user.years.includes(row.year))
            .filter(row => row.factor == "Public Goods Allocated Per Person")
            .filter(row => row.series == "Percentage Change in 2026 Dollars of Household Income")
            .reduce((acc, inc) => inc[dec] + acc, 0) * user.publicGoodsRatio

        row.push(sum / user.years.length * user.publicGoods)
    }
    return row // whole series
}

// chart in dollars
const svg = d3.select("figure svg#dollarsChartSVG"),
    margin = {top: 10, bottom: 50, left: 50, right: 20},
    width = svg.attr("width") - margin.left - margin.right,
    height = svg.attr("height") - margin.top - margin.bottom,
    chart = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`),
    x = d3.scaleBand().domain(decileKeysNoAll).range([0, width]).padding(0.1),
    y = d3.scaleLinear().domain([-5e3,25e3]).range([height,margin.top])

// chart in %
const svgPCT = d3.select("figure svg#pctChartSVG"),
    marginPCT = {top: 10, bottom: 50, left: 50, right: 20},
    widthPCT = svgPCT.attr("width") - marginPCT.left - marginPCT.right,
    heightPCT = svgPCT.attr("height") - marginPCT.top - marginPCT.bottom,
    chartPCT = svgPCT.append("g").attr("transform", `translate(${marginPCT.left},${marginPCT.top})`),
    xPCT = d3.scaleBand().domain(decileKeysNoAll).range([0, widthPCT]).padding(0.1),
    yPCT = d3.scaleLinear().domain([-.1,.05]).range([heightPCT,marginPCT.top]),
    yPCTFormat = x => (x * 100).toFixed(x==0 ? "0" : Math.abs(yPCT.domain()[0]) < .01 && Math.abs(yPCT.domain()[1]) < .01 ? 1 : 0) // add a little more precision when the domain is very small

const factorKeys = ["Federal Taxes and Cash Transfers","Federal and State In-Kind Transfers","State Financing","Public Goods"]
const stacked = d3.stack().keys(factorKeys).offset(d3.stackOffsetDiverging)
const factorColors = {["Federal Taxes and Cash Transfers"]: "#BEDF6A", ["Federal and State In-Kind Transfers"]: "#45BA97", ["State Financing"]: "#4D849D", ["Public Goods"]: "#6C4C67"}
const formatTooltipDollars = d3.format("$,.0f")
const formatTooltipPCT = d3.format(".1%")
const decilesLabels = d3.scaleOrdinal().domain(decileKeysNoAll).range(["Lowest","2nd","3rd","4th","5th","6th","7th","8th","9th","Highest"])

chart.append("text").text("Household income group (deciles)").style("font-weight", 700).attr("x", width/2).attr("y", height + 40).style("text-anchor", "middle").style("font-family", "sans-serif").style("font-size",".8em")
chartPCT.append("text").text("Household income group (deciles)").style("font-weight", 700).attr("x", width/2).attr("y", height + 40).style("text-anchor", "middle").style("font-family", "sans-serif").style("font-size",".8em")

d3.csv("data.csv", d3.autoType).then(data => {

    // curry the series definition functions with data
    // resulting functions only need inputs, which only comes from inside update()
    const marketIncomeData = marketIncome(data)
    const socialInsuranceData = socialInsurance(data)
    const meansTestedData = meansTested(data)
    const federalTaxesData = federalTaxes(data)
    const incomeAfterData = incomeAfter(data)
    // const nominalData = nominal(data)
    const realChangeData = realChange(data)
    // const baselineAnnualData = baselineAnnual(data)
    const annualAverageData = annualAverage(data)
    const changeInDollarsData = changeInDollars(data)
    const fedTaxesAndCashTransfersDollarsData = fedTaxesAndCashTransfersDollars(data)
    const federalStateInKindDollarsData = federalStateInKindDollars(data)
    const stateFinancingDollarsData = stateFinancingDollars(data)
    const publicGoodsDollarsData = publicGoodsDollars(data)
    const fedTaxesAndCashTransfersPCTData = fedTaxesAndCashTransfersPCT(data)
    const federalStateInKindPCTData = federalStateInKindPCT(data)
    const stateFinancingPCTData = stateFinancingPCT(data)
    const publicGoodsPCTData = publicGoodsPCT(data)

    chart.append("g").classed("x-axis", true).call(d3.axisBottom(x).tickFormat(decilesLabels)).attr("transform", `translate(0, ${height})`)
    chart.append("g").classed("y-axis", true).call(d3.axisLeft(y)).attr("transform", `translate(0,0)`)

    chartPCT.append("g").classed("x-axis", true).call(d3.axisBottom(xPCT).tickFormat(decilesLabels)).attr("transform", `translate(0, ${height})`)
    chartPCT.append("g").classed("y-axis", true).call(d3.axisLeft(yPCT)).attr("transform", `translate(0,0)`)
    
    function update() {

        // validation: at least one Year checkbox has to be checked
        const yearsboxes = d3.selectAll("#yearsInputs input:checked").nodes()
        if(yearsboxes.length == 1) {
            yearsboxes[0].disabled = true 
        } else {
            d3.selectAll("#yearsInputs input").property("disabled", false)
        }

        // make an object out of the state of the user form
        const inputs = {}
        inputs.federalTaxesAndCashTransfers = d3.select("#includeFedTaxes").property("checked") ? 1 : 0
        inputs.years = d3.selectAll("#yearsInputs input:checked").nodes().map(n => Number(n.name))
        inputs.inkind = d3.select("#includeInKind").property("checked") ? 1 : 0
        inputs.stateFinance = d3.select("#includeStateFinancing").property("checked") ? 1 : 0
        inputs.publicGoods = d3.select("#includePublicGoods").property("checked") ? 1 : 0
        
        // validate the DOM number input, because it is very permissive
        d3.select("#proportionPerPerson").on("change", null) // turn off events while we validate and update this value
        let numInput = Number(d3.select("#proportionPerPerson").property("value"))
        if(isNaN(numInput) || numInput === "" || numInput === " " || numInput == undefined || numInput == null) {
            numInput = .5
        } else if(numInput < 0){
            numInput = 0
        } else if(numInput > 1) {
            numInput = 1
        }
        inputs.publicGoodsRatio = numInput
        d3.select("#proportionPerPerson").property("value", numInput)
        d3.select("#proportionPerPerson").on("change", update)

        // format a string of the input years ranges e.g. "2027 and 2029–2031" and add it to figure titles
        let yearString = ""
        {
            let start = inputs.years[0]
            let end = inputs.years[0]
            let ranges = [];
            for(let i = 1; i < inputs.years.length; i++) {
                if(inputs.years[i] == end +1) {
                    end = inputs.years[i]
                } else {
                    ranges.push((start == end ? `${start}` : `${start}–${end}`))
                    start = inputs.years[i]
                    end = inputs.years[i]
                }
            }
            ranges.push(start == end ? `${start}` : `${start}–${end}`)
            if(ranges.length > 1) ranges[ranges.length-1] = `and ${ranges[ranges.length-1]}`
            yearString = ranges.join(ranges.length > 2 ? ", " : " ")
        }
        d3.selectAll(".yearRange").html(yearString)

        // strikethrough the disabled series in the legends
        d3.selectAll(".legend tr:nth-child(1) td:not(:first-child)").style("text-decoration", inputs.federalTaxesAndCashTransfers ? null : "line-through")
        d3.selectAll(".legend tr:nth-child(2) td:not(:first-child)").style("text-decoration", inputs.inkind ? null : "line-through")
        d3.selectAll(".legend tr:nth-child(3) td:not(:first-child)").style("text-decoration", inputs.stateFinance ? null : "line-through")
        d3.selectAll(".legend tr:nth-child(4) td:not(:first-child)").style("text-decoration", inputs.publicGoods ? null : "line-through")

        // components of income table
        d3.selectAll("#components tr:nth-child(1) td:not(:first-child)").data(marketIncomeData(inputs).map(formatBaselineAnnual)).text(d => d)
        d3.selectAll("#components tr:nth-child(2) td:not(:first-child)").data(socialInsuranceData(inputs).map(formatBaselineAnnual)).text(d => d)
        d3.selectAll("#components tr:nth-child(3) td:not(:first-child)").data(meansTestedData(inputs).map(formatBaselineAnnual)).text(d => d)
        d3.selectAll("#components tr:nth-child(4) td:not(:first-child)").data(federalTaxesData(inputs).map(formatBaselineAnnual)).text(d => d)
        d3.selectAll("#components tr:nth-child(5) td:not(:first-child)").data(incomeAfterData(inputs).map(formatBaselineAnnual)).text(d => d)

        // combined analysis table
        const realChangeRow = realChangeData(inputs)
        d3.selectAll("#combined tr:nth-child(1) td:not(:first-child)").data(realChangeRow.map(formatNominalChangeNumbers)).text(d => d)
        d3.selectAll("#combined tr:nth-child(2) td:not(:first-child)").data(shareOfChange(realChangeRow).map(formatShareOfChange)).text(d => d)
        d3.selectAll("#combined tr:nth-child(3) td:not(:first-child)").data(annualAverageData(inputs).map(formatBaselineAnnual)).text(d => d)
        d3.selectAll("#combined tr:nth-child(4) td:not(:first-child)").data(changeInDollarsData(inputs).map(formatShareOfChange)).text(d => d)

        let dollarsData = []

        // each series in chart
        const fedCashCalc = fedTaxesAndCashTransfersDollarsData(inputs)
        const inKindCalc = federalStateInKindDollarsData(inputs)
        const stateFinanceCalc = stateFinancingDollarsData(inputs)
        const publicGoodsCalc = publicGoodsDollarsData(inputs)

        // data structure used by chart
        for(let i = 0; i < decileKeysNoAll.length; i++) {
            dollarsData.push({
                decile: decileKeysNoAll[i],
                ["Federal Taxes and Cash Transfers"]: fedCashCalc[i],
                ["Federal and State In-Kind Transfers"]: inKindCalc[i],
                ["State Financing"]: stateFinanceCalc[i],
                ["Public Goods"]: publicGoodsCalc[i]
            })
        }

        const fedPCTCalc = fedTaxesAndCashTransfersPCTData(inputs)
        const inKindPCTCalc = federalStateInKindPCTData(inputs)
        const stateFinancePCTCalc = stateFinancingPCTData(inputs)
        const publicGoodsPCTCalc = publicGoodsPCTData(inputs)
        
        let pctData = []
        for(let i = 0; i < decileKeysNoAll.length; i++) {
            pctData.push({
                decile: decileKeysNoAll[i],
                ["Federal Taxes and Cash Transfers"]: fedPCTCalc[i],
                ["Federal and State In-Kind Transfers"]: inKindPCTCalc[i],
                ["State Financing"]: stateFinancePCTCalc[i],
                ["Public Goods"]: publicGoodsPCTCalc[i]
            })
        }

        // update y domain based on the extents of the stacked data
        y.domain(d3.extent(stacked(dollarsData).flat().flat())).nice()
        chart.select("g.y-axis").transition().call(d3.axisLeft(y).ticks(6))

        yPCT.domain(d3.extent(stacked(pctData).flat().flat())).nice()
        chartPCT.select("g.y-axis").transition().call(d3.axisLeft(yPCT).ticks(6)
            .tickFormat((d, _, a) => {
                const w = a.map(z => z.__data__) // all tick values
                    .map(z => z * 100) // as percent
                    .map(z => z % 1) // fractional part
                    .map(Math.abs) // magnitude
                    .filter(z => z != 0) // exclude zero
                    .map(z => Math.floor(Math.log10(z))) // order of magnitude
                    .map(Math.abs) // positive numbers for .toFixed()
                    .reduce((acc, inc) => Math.max(acc, inc), 0) // most places after 0
                    
                return d == 0 ? "0" : (d * 100).toFixed(w) // always format zero as "0" with no decimal
        })
    )

        const dollarsSelectionFactors = chart
            .selectAll("g.factorGroup")
                .data(stacked(dollarsData))
        
        // entering
        dollarsSelectionFactors
            .enter()
            .append("g").classed("factorGroup", true)
            .style("fill", d => factorColors[d.key])
                .selectAll("rect.dataRects")
                .data(d => d)
                    .enter().append("rect").classed("dataRects", true)
                        .attr('x', d => x(d.data.decile))
                        .attr('y', d => y(d[1]))
                        .attr('height', d => y(d[0]) - y(d[1]))
                        .attr('width', x.bandwidth())

        // updating
        dollarsSelectionFactors
            .selectAll("rect.dataRects")
            .data(d => d)
                .transition()
                .attr('y', d => y(d[1]))
                .attr('height', d => y(d[0]) - y(d[1]))

        // zero baseline
        const selectBaseline = chart.selectAll("#dollarsBaseline")
            .data([0])
        selectBaseline
            .enter().append("line")
                .attr("id", "dollarsBaseline")
                .style("stroke", "black")
                .style("stroke-width", "1")
                .attr("x1", x.range()[0])
                .attr("x2", x.range()[1])                
            .merge(selectBaseline)
                .transition()
                .attr("y1", y(0))
                .attr("y2", y(0))

        // net effect series: sum of the four other series. one row each decile
        const netEffectCalc = dollarsData.map(row => ({decile: row.decile, value: Object.values(row).filter(v => !isNaN(v)).reduce((a,b) => a + b)}))

        const dollarsSelection = chart
            .selectAll("rect.netEffectMark")
            .data(netEffectCalc)
            
        const entering = dollarsSelection
            .enter()
            .append("rect").classed("netEffectMark", true)
                .attr("x", d => x(d.decile) + x.bandwidth()/2 - 5)
                .attr("width", 10)
                .attr("height", 10)
                .style("fill", "white")
                .style("stroke", "black")
                .style("stroke-width", 2)
                .style("transform-origin", "center")
                .style("transform", "rotate(45deg)")
                .style("transform-box", "fill-box")
        
        // merged selection
        dollarsSelection.merge(entering)
            .transition()
            .attr("y", d => y(d.value) - 5)        
        
        chart.selectAll("rect.hitbox")
            .data(dollarsData)
                .enter().append("rect").classed("hitbox", true)
                    .attr("stroke", "black")
                    .attr("stroke-width", 5)
                    .attr('x', d => x(d.decile))
                    .attr('y', y.range()[1])
                    .attr('height', y.range()[0]-y.range()[1])
                    .attr('width', x.bandwidth())
                    .attr("visibility", "hidden")
                    .attr("pointer-events", "all")
                    .on("mouseenter", (evt, d) => {
                        const mx = evt.pageX, my = evt.pageY
                        d3.select("#dollarsTooltip")
                            .style("top", `${my}px`)
                            .style("left", `${mx}px`)
                            .style("display", "inherit")
                            .style("transform", `translate(${(["d10","d9","d8","d7","d6","d5"]).includes(d.decile) ? -100 : 0}%,0%)`)
                        d3.select("#dollarsTooltipLabel").html(decilesLabels(d.decile))
                        d3.select("#dollarsTooltip tr:nth-child(1) td:not(:first-child)").html(formatTooltipDollars(d["Federal Taxes and Cash Transfers"]))
                        d3.select("#dollarsTooltip tr:nth-child(2) td:not(:first-child)").html(formatTooltipDollars(d["Federal and State In-Kind Transfers"]))
                        d3.select("#dollarsTooltip tr:nth-child(3) td:not(:first-child)").html(formatTooltipDollars(d["State Financing"]))
                        d3.select("#dollarsTooltip tr:nth-child(4) td:not(:first-child)").html(formatTooltipDollars(d["Public Goods"]))
                        d3.select("#dollarsTooltip tr:nth-child(5) td:not(:first-child)").html(formatTooltipDollars(d["Federal Taxes and Cash Transfers"] + d["Federal and State In-Kind Transfers"] + d["State Financing"] + d["Public Goods"]))
                    })
        chart.on("mouseleave", () => {
            d3.select("#dollarsTooltip").style("display", "none")
        })

        const pctSelectionFactors = chartPCT
        .selectAll("g.factorGroup")
            .data(stacked(pctData))
    
        // entering
        pctSelectionFactors
            .enter()
            .append("g").classed("factorGroup", true)
            .style("fill", d => factorColors[d.key])
                .selectAll("rect.dataRects")
                .data(d => d)
                    .enter().append("rect").classed("dataRects", true)
                        .attr('x', d => xPCT(d.data.decile))
                        .attr('y', d => yPCT(d[1]))
                        .attr('height', d => yPCT(d[0]) - yPCT(d[1]))
                        .attr('width', xPCT.bandwidth())

        // updating
        pctSelectionFactors
            .selectAll("rect.dataRects")
            .data(d => d)
                .transition()
                .attr('y', d => yPCT(d[1]))
                .attr('height', d => yPCT(d[0]) - yPCT(d[1]))

        const selectBaselinePCT = chartPCT.selectAll("#pctBaseline")
                .data([0])
            selectBaselinePCT
                .enter().append("line")
                    .attr("id", "pctBaseline")
                    .style("stroke", "black")
                    .style("stroke-width", "1")
                    .attr("x1", xPCT.range()[0])
                    .attr("x2", xPCT.range()[1])                
                .merge(selectBaselinePCT)
                    .transition()
                    .attr("y1", yPCT(0))
                    .attr("y2", yPCT(0))   

        // net effect series: sum of the four other series. one row each decile
        const netEffectCalcPCT = pctData.map(row => ({decile: row.decile, value: Object.values(row).filter(v => !isNaN(v)).reduce((a,b) => a + b)}))

        const pctSelection = chartPCT
            .selectAll("rect.netEffectMark")
            .data(netEffectCalcPCT)
            
        const enteringPCT = pctSelection
            .enter()
            .append("rect").classed("netEffectMark", true)
                .attr("x", d => xPCT(d.decile) + xPCT.bandwidth()/2 - 5)
                .attr("width", 10)
                .attr("height", 10)
                .style("fill", "white")
                .style("stroke", "black")
                .style("stroke-width", 2)
                .style("transform-origin", "center")
                .style("transform", "rotate(45deg)")
                .style("transform-box", "fill-box")
        
        // merged selection
        pctSelection.merge(enteringPCT)
            .transition()
            .attr("y", d => yPCT(d.value) - 5)
 
        
        chartPCT.selectAll("rect.hitbox")
            .data(pctData)
                .enter().append("rect").classed("hitbox", true)
                    .attr("stroke", "black")
                    .attr("stroke-width", 5)
                    .attr('x', d => xPCT(d.decile))
                    .attr('y', yPCT.range()[1])
                    .attr('height', yPCT.range()[0]-yPCT.range()[1])
                    .attr('width', xPCT.bandwidth())
                    .attr("visibility", "hidden")
                    .attr("pointer-events", "all")
                    .on("mouseenter", (evt, d) => {
                        const mx = evt.pageX, my = evt.pageY
                        d3.select("#pctTooltip")
                            .style("top", `${my}px`)
                            .style("left", `${mx}px`)
                            .style("display", "inherit")
                            .style("transform", `translate(${(["d10","d9","d8","d7","d6","d5"]).includes(d.decile) ? -100 : 0}%,0%)`)
                        d3.select("#pctTooltipLabel").html(decilesLabels(d.decile))
                        d3.select("#pctTooltip tr:nth-child(1) td:not(:first-child)").html(formatTooltipPCT(d["Federal Taxes and Cash Transfers"]))
                        d3.select("#pctTooltip tr:nth-child(2) td:not(:first-child)").html(formatTooltipPCT(d["Federal and State In-Kind Transfers"]))
                        d3.select("#pctTooltip tr:nth-child(3) td:not(:first-child)").html(formatTooltipPCT(d["State Financing"]))
                        d3.select("#pctTooltip tr:nth-child(4) td:not(:first-child)").html(formatTooltipPCT(d["Public Goods"]))
                        d3.select("#pctTooltip tr:nth-child(5) td:not(:first-child)").html(formatTooltipPCT(d["Federal Taxes and Cash Transfers"] + d["Federal and State In-Kind Transfers"] + d["State Financing"] + d["Public Goods"]))
                            
                    })
        chartPCT.on("mouseleave", () => {
            d3.select("#pctTooltip").style("display", "none")
        })

        d3.select("#exportData").on("click", () => {
            let csvText = ["Series","Lowest","2nd","3rd","4th","5th","6th","7th","8th","9th","Highest","All"].join(",").concat("\r\n") // header row (column names)
            csvText += ["Total change (billions of 2025 dollars)", ...realChangeData(inputs).map(d => d.toFixed(1))].join(",").concat("\r\n")
            csvText += ["Share of total change (percent)", ...shareOfChange(realChangeRow).map(d => (d * 100).toFixed(1))].join(",").concat("\r\n")
            csvText += ["Annual average change per household (2025 dollars)", ...annualAverageData(inputs).map(d => d.toFixed(0))].join(",").concat("\r\n")
            csvText += ["Annual average change per household (percentof current law income after transfers and taxes)", ...changeInDollarsData(inputs).map(d => (d * 100).toFixed(1))].join(",").concat("\r\n")
            
            downloadCSV(csvText, "CBO_combined-distributional-analysis.csv")
        })

        d3.select("#exportDataComponents").on("click", () => {

            let csvText = ["Series","Lowest","2nd","3rd","4th","5th","6th","7th","8th","9th","Highest","All"].join(",").concat("\r\n") // header row (column names)
            csvText += ["Market income", ...marketIncomeData(inputs).map(d => d.toFixed(0))].join(",").concat("\r\n")
            csvText += ["Social insurance", ...socialInsuranceData(inputs).map(d => d.toFixed(0))].join(",").concat("\r\n")
            csvText += ["Means-tested transfers", ...meansTestedData(inputs).map(d => d.toFixed(0))].join(",").concat("\r\n")
            csvText += ["Federal taxes", ...federalTaxesData(inputs).map(d => d.toFixed(0))].join(",").concat("\r\n")
            csvText += ["Income after transfers and taxes", ...incomeAfterData(inputs).map(d => d.toFixed(0))].join(",").concat("\r\n")
            
            downloadCSV(csvText, "CBO_components-of-income.csv")
        })

        d3.select("#exportDataDollars").on("click", () => { 
            let csvText = ["Household income decile", "Federal taxes and cash transfers", "Federal and state in-kind transfers", "State financing", "Other revenue and spending", "Net effect"].join(",").concat("\r\n")
            dollarsData.forEach((row, i) => {
                csvText+=`${decilesLabels(row.decile)},${factorKeys.map(key => row[key].toFixed(0)).join(",").concat(","+netEffectCalc[i].value.toFixed(0)).concat("\r\n")}`
            })
            
            downloadCSV(csvText, "CBO_income-change-dollars.csv")
        })

        d3.select("#exportDataPCT").on("click", () => { 
            let csvText = ["Household income decile", "Federal taxes and cash transfers", "Federal and state in-kind transfers", "State financing", "Other revenue and spending", "Net effect"].join(",").concat("\r\n")
            pctData.forEach((row, i) => {
                csvText+=`${decilesLabels(row.decile)},${factorKeys.map(key => (row[key] * 100).toFixed(1)).join(",").concat(","+(netEffectCalcPCT[i].value * 100).toFixed(1)).concat("\r\n")}`
            })
            
            downloadCSV(csvText, "CBO_income-change-percent.csv")
        })
    } // end of update function

    update()

    d3.selectAll('#yearsInputs input[type="checkbox"]').on("change", update)
    d3.select("#includeFedTaxes").on("change", update)
    d3.select("#includeStateFinancing").on("change", update)
    d3.select("#includeInKind").on("change", update)
    d3.select("#includePublicGoods").on("change", update)
    d3.select("#proportionPerPerson").on("change", update)
})

// triggers a .csv download of CSV string data. works in IE
function downloadCSV (data, filename) {
    const blob =  new Blob([data], { type: 'text/csv;charset=utf-8;' })
  
    if (navigator.msSaveBlob) { // IE 10+
        navigator.msSaveBlob(blob, filename);
    } else {
        var link = document.createElement("a");
        if (link.download !== undefined) { // feature detection
            // Browsers that support HTML5 download attribute
            var url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", filename);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }
  }