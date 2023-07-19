async function Scrape(){
  const puppeteer = require('puppeteer-extra')
  const fs = require("fs")
  
  // add stealth plugin and use defaults (all evasion techniques)
  const StealthPlugin = require('puppeteer-extra-plugin-stealth')
  puppeteer.use(StealthPlugin())

  // puppeteer usage as normal
  try{
    const browser = await puppeteer.launch({ headless: true })
    const page = await browser.newPage()
    await page.goto('https://www.kkday.com/en-sg/promo/sgpromo?ud1=sg&ud2=pd')
    await page.waitForTimeout(5000)
    const initState = await page.evaluate(() => {
      return window.__INIT_STATE__;
    });
    coupons = initState.state.campaign_config.sections.filter(obj => obj.type === 'coupon').map(obj => obj.coupons).filter(obj => {
      return obj.filter(obj2 => obj2.desc.toLowerCase().includes('hsbc') || obj2.desc.toLowerCase().includes('uob') || obj2.desc.toLowerCase().includes('ocbc'))
    }).map(obj => {
      return obj.map(obj2 => {
        const number = obj2.title.match(/\d+/);
        return number ? Number(number[0]) : null;
      })
    });
    couponsArray = coupons.flat().map(obj => { return obj ? obj : 0 });
    await browser.close()
    return Math.max(...couponsArray);
  }catch(err){
    return 0
  }
}

Scrape().then((best_price) => {
  console.log("Best discount from KKDays: " + best_price)
})