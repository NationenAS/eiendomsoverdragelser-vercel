const Loader = require('../loader')
const fs = require('fs')

export default async function handler(req, res) {

    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', true)
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST')
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version')
    
    // Enable cache
    res.setHeader('Cache-Control', 's-maxage=43200') // 12 hours

    // ----- //
    
    // From and to (yyyy-mm-dd)
    let toDate = new Date()
    let toDateFormatted = toDate.toISOString().slice(0, 10)
    let fromDate = toDate
    fromDate.setDate(toDate.getDate() - 60)
    let fromDateFormatted = toDate.toISOString().slice(0, 10)

    // Load
    let sales = await Loader.load(fromDateFormatted, toDateFormatted)

    // Print
    res.send(sales)
}