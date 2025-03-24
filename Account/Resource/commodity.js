const getVendorName = function (vendor) {
	return dv.page(vendor).file.name || vendor
}
const getBreakdownTime = function (page) {
	const time = page.time || page.file.mtime
	const timestamp = new Date(time).getTime()
	return moment(timestamp).format("YYYY/MM/DD")
}

const overview = dv.page("Account/Overview");
const link = input.current.file.link
let allVendors = []
let datas = {}
let content = [
  //["`BUTTON[asdf]` `BUTTON[asdf]`", "`BUTTON[asdf]`", "`BUTTON[asdf]`", "`BUTTON[asdf]`"],
]
let labels = []
let datasets = []
for (const breakdown of dv
	.pages('"Account"')
	.where(function (page) {
		const commodity = page.commodity
		if (typeof commodity === "undefined") return false
		return page.commodity.equals(link)
	})) {
		if (breakdown.vendor === null) throw new Error("No vendor declared")

		const time = getBreakdownTime(breakdown)
		const vendor = getVendorName(breakdown.vendor)
		content.push([
			time,
			breakdown.file.link,
			vendor,
			Intl.NumberFormat(overview.locale, {
				style: "currency",
				currency: overview.currency
			}).format(breakdown.price)
		])
		if (!(time in datas)) datas[time] = {}
		if (!(vendor in datas[time])) datas[time][vendor] = null
		if (datas[time][vendor] == null || datas[time][vendor] < breakdown.price) datas[time][vendor] = breakdown.price
}

const sortedTime = Object.keys(datas).sort((a, b) => {
	if (a > b) return 1
	if (a < b) return -1
	return 0
}).slice(-7)

for (let i = 0; i < sortedTime.length; i++) {
	const time = sortedTime[i]
	const vendors = Object.keys(datas[time])

	vendors.forEach((vendor) => addDataset(i, vendor))
	allVendors.filter(v => !vendors.contains(v)).forEach((vendor) => addDataset(i, vendor))
}

allVendors.forEach((vendor) => {
})

function addDataset(i, vendor) {
	const previousTime = i > 0 ? sortedTime[i - 1] : null
	const time = sortedTime[i]

		if(!allVendors.contains(vendor)) allVendors.push(vendor)
		const index = datasets.findIndex(d => d.label === vendor)
		const hasPrice = vendor in datas[time]
		const hasPreviousPrice = previousTime != null
		const price = hasPrice ? datas[time][vendor] : (hasPreviousPrice ? datas[previousTime][vendor] : null)
		if (!hasPrice && hasPreviousPrice) datas[time][vendor] = price
		if (index === -1) {
				let page = dv.page(`Account/Vendor/${vendor}.md`)
				let colour = page === null ? "#00FF00" : page.colour
				datasets.push({
						label: vendor,
						data: [price],
						borderColor: colour,
						tension: 0.1,
				})
		} else {
				datasets[index].data.push(price)
		}
}

const chartData = {
    type: 'line',
    data: {
        // labels: labels.map(f => getBreakdownTime(f)),
        labels: sortedTime,
        datasets,
    }
}

window.renderChart(chartData, input.container)
dv.table(["Date", "Files", "Vendor", "Price"], content)

// For sorting tools:
//`BUTTON[asdf]`

