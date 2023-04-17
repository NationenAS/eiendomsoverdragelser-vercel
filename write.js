const Loader = require('./loader');
const fs = require('fs');

(async () => {
    // From and to (yyyy-mm-dd)
    let toDate = new Date()
    let toDateFormatted = toDate.toISOString().slice(0, 10)
    let fromDate = toDate
    fromDate.setDate(toDate.getDate() - 60)
    let fromDateFormatted = toDate.toISOString().slice(0, 10)

    // Load
    let sales = await Loader.load(fromDateFormatted, toDateFormatted)

    // Write
    let salesJSON = JSON.stringify(sales)
    fs.writeFileSync('./sales.json', salesJSON)
})()