function scrapeTripcom(data){
    const prodName = data['productInfos']['0']['basicInfo']['productName'];
    const minPrice = data['productInfos']['0']['basicInfo']['minPrice'];
    const marketPrice = data['productInfos']['0']['basicInfo']['marketPrice'];

    return {"productName" : prodName, "minPrice": minPrice, "marketPrice": marketPrice};
}

function scrapeKKdays(data, id) {
    const min_price = data['data']['PACKAGE'][id]['sale_price']['min_price'] == null ? Infinity : data['data']['PACKAGE'][id]['sale_price']['min_price']
    const max_price = data['data']['PACKAGE'][id]['sale_price']['max_price'] == null ? Infinity : data['data']['PACKAGE'][id]['sale_price']['max_price']
    const official_price = data['data']['PACKAGE'][id]['sale_price']['official_price'] == null ? Infinity : data['data']['PACKAGE'][id]['sale_price']['official_price']
    
    
    return {"minPrice": min_price, "maxPrice": max_price, "officialPrice": official_price};
}

module.exports = {scrapeTripcom, scrapeKKdays}