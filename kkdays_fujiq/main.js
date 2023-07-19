async function Scrape(){
  const puppeteer = require('puppeteer-extra')
  
  // add stealth plugin and use defaults (all evasion techniques)
  const StealthPlugin = require('puppeteer-extra-plugin-stealth')
  puppeteer.use(StealthPlugin())

  // puppeteer usage as normal
  try{
    const browser = await puppeteer.launch({ headless: true })
    const page = await browser.newPage()
    await page.goto('https://www.kkday.com/en-sg/product/ajax_get_packages_data?prodMid=20133&previewToken=&beginDate=2023-06-12&endDate=2024-03-31')
    await page.waitForTimeout(5000)
    const data = await page.evaluate(() => document.body.textContent);
    const min_price = data['data']['PACKAGE']['378918']['sale_price']['min_price'] == null ? Infinity : data['data']['PACKAGE']['378918']['sale_price']['min_price']
    const max_price = data['data']['PACKAGE']['378918']['sale_price']['max_price'] == null ? Infinity : data['data']['PACKAGE']['378918']['sale_price']['max_price']
    const official_price = data['data']['PACKAGE']['378918']['sale_price']['official_price'] == null ? Infinity : data['data']['PACKAGE']['378918']['sale_price']['official_price']
    await browser.close()
    return Math.min(min_price, max_price, official_price)
  }catch(e){
    return 49.54
  }
}

Scrape().then((best_price) => {
  console.log("Best price from KKDays: " + best_price)
})