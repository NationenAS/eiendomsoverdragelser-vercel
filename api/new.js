const turf = require('@turf/turf')
const Bot = require("../bot.js")
const { kv } = require("@vercel/kv")

export default async function handler(req, res) {

    const thresholdPrice = 8000000
    const thresholdArea = 5000

    // Check for new sales, return sales and new sales
    async function getNew(sales) {
        let oldSales = await kv.get("sales")
        let newSales = await sales.filter(s => !oldSales.includes(s.saleId))
        return { sales: sales, new: newSales }
    }

    // Set sales, return sales and KV status
    async function setAll(sales) {
        let salesIds = sales.sales.map(s => s.saleId)
        let salesJson = JSON.stringify(salesIds)
        let cmd = await kv.set("sales", salesJson)
        return {sales: sales, status: cmd}
    }

    // Get area
    async function getArea(sale, i) {
        let properties = sale.prop.map(p => 
            fetch("https://ws.geonorge.no/eiendom/v1/geokoding?matrikkelnummer=" + p.matNumb + "&omrade=true&utkoordsys=4326")
            .then(r => r.json())
            .then(geojson => Math.round(turf.area(geojson) / 1000))
            .catch(e => console.log(e))
        )
        let area = await Promise.all(properties)
            .then(areas => areas.reduce((a,b) => a + b, 0))
            .catch(e => console.log(e))
        return { sale: sale, area: area}
    }

    // Check new sales for price or area, return sales and array of new sales
    async function checkSignificant(sales) {
        console.log("Checking significance of " + sales.new.length + " new objects.")
        let newSales = sales.new.map((n,i) => {
            return getArea(n, i).then(sale => {
                if (sale.sale.price > thresholdPrice || sale.area > thresholdArea) {
                    return `Ny gård solgt for ${sale.sale.price.toLocaleString('nb-NO')} kr, på ${sale.area} mål (https://eiendomsoverdragelser.vercel.app/?id=${sale.sale.saleId}).`
                }
                else {
                    return null
                }
            })
        })
        let significant = await Promise.all(newSales)
        return { sales: sales.sales, significant: significant }
    }

    // Run
    // Get all sales
    const allSales = await fetch("https://eiendomsoverdragelser-vercel.vercel.app/api/sales").then(r => r.json()).catch(e => console.log(e))
    // Filter by new sales
    const newSales = await getNew(allSales)

    if (newSales.new.length == 0) {
        return res.send("No new sales.")
    }
    else {
        const newChecked = await checkSignificant(newSales)
        const significant = newChecked.significant.filter(s => s != null)
        const joined = significant.join(" • ")
        const bot = joined != "" ? await Bot.send(joined) : "No new significant sales."
        console.log(bot)
        const setSales = await setAll(newSales)
    
        return res.send(setSales.status)
    }

}