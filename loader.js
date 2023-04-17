function clean(data) {
    let sales = []
    let now = new Date().toLocaleString('nb-NO')
    console.log(`${now}: Got ${data.Hits.length} hits from 1881`)
    
    function getFromTo(string) {
        let fromTo = string.substring((string.indexOf(" fra ") + 5)).split(" til ")
        let to = fromTo.length == 1 ? "" : fromTo[1].substring(0, (fromTo[1].indexOf("(") - 1))
        // return { from: fromTo[0], to:  fromTo[1].substring(0, (fromTo[1].indexOf("(") - 1)) }
        return [fromTo[0], to]
    }

    //  Loop though Hits
    data.Hits.forEach(d => {

        if (d.Property.Sale.Type == "Uskiftebevilling") return // Skip, not relevant

        let id = d.Property.Sale.Id
        let xy = d.Property.StreetAddress.Coordinate ? [parseInt(d.Property.StreetAddress.Coordinate.Latitude).toFixed(5), parseInt(d.Property.StreetAddress.Coordinate.Longitude).toFixed(5)] : null
        let address = d.Property.StreetAddress.StreetName ? d.Property.StreetAddress.StreetName + " " + d.Property.StreetAddress.HouseNumber : null
        let mn = d.Property.Sale.NewsletterFormatText.split(";")
        let mnFormat = mn[9] + "-" + mn[10] + "/" + mn[11] + "/" + mn[12] + "/" + mn[13]
        let fromTo = d.Property.Sale.LineId === 1 ? getFromTo(d.Property.Sale.InfoText) : undefined
    
        // If sale does not exist, push new sale
        if (!sales.some(s => s.saleId == id)) {      
            let date = new Date(d.Property.Sale.SoldDate).toLocaleDateString()
            let sale =({
                saleId: id,
                multiple: false,
                price: d.Property.Sale.Price,
                date: date,
                type: d.Property.Sale.Type,  
                fromto: "",
                prop: [{
                    isPartOf: d.Property.Sale.InfoText.includes("ndel av") ? true : false,
                    type: d.Property.BuildingType,
                    coord: xy,
                    address: address,
                    municipality: d.Property.StreetAddress.Municipality,
                    matNumb: mnFormat
                }]       
            })
            if (d.Property.Sale.LineId === 1) sale.fromto = fromTo
            sales.push(sale)
        }

        // If sale exist, unshift new property
        else {
            let i = sales.findIndex(x => x.saleId == id) // Find SaleId array index
            sales[i].multiple = true
            sales[i].prop.unshift({
                isPartOf: d.Property.Sale.InfoText.includes("ndel av") ? true : false,
                type: d.Property.BuildingType,
                coord: xy,
                address: address,
                municipality: d.Property.StreetAddress.Municipality,
                matNumb: mnFormat                  
            })
            if (d.Property.Sale.LineId === 1) sales[i].fromto = fromTo 
        }
    })
    
    console.log(`After cleaning this resulted in ${sales.length} sales`)
    return sales
}

async function load(fromDate, toDate) {

    let url = `https://services.api.no/api/acies/v1/external/1881/property/?querystring=&filters=PropertyType:Landbruk/fiske,PropertySoldDate:${fromDate}--${toDate}&fields=*&rows=3000&sortby=propertysolddate%20DESC,saleId%20ASC`

    function get(url) {
        return new Promise((resolve, reject) => (
            fetch(url)
            .then(resp => resp.json())
            .then(data => clean(data))
            .then(cleaned => resolve(cleaned))
            .catch(err => reject(err))
        ))
    }

    return get(url)
}

module.exports = { load }