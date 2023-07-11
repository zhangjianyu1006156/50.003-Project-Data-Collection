const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const { start } = require('repl');

puppeteer.use(StealthPlugin());

async function scrapeProduct(url) {
  var data = ""
  const browser = await puppeteer.launch({ headless: true, ignoreHTTPSErrors: true });
  const page = await browser.newPage();
  
  await page.setRequestInterception(true);

  page.on('request', async (interceptedRequest) => {
    if (interceptedRequest.method().includes('POST') 
        && interceptedRequest.url().includes('//queryAdsDisplayData')){
      
      const methods = interceptedRequest.method();
      const headerss = interceptedRequest.headers();
      const postDatas = interceptedRequest.postData();
      
      //modify request payload
      interceptedRequest.continue({method: methods, postData : postDatas, headers:headerss});

    } else {
      interceptedRequest.continue();
    }
  })
  
  page.on('response', async (response) => {
    if(response.url().includes('/queryAdsDisplayData')){
      //wait for response
      await page.waitForTimeout(2000);
      try {
        data = await response.json(); //get json file
      } 
      catch (error) {
      }
    } 
  })

  await page.goto(url);
  await page.waitForTimeout(5000);
  await browser.close();

  return data;
}

//plug in product url
const productUrl = "https://sg.trip.com/sale/deals/" 

scrapeProduct(productUrl).then((data) => { 
  ads = data["adsWidgetDataTypes"][0]["adsDisplayDataTypes"] 
  //check if there's bank card discounts
  const theresDiscounts = ads.some(ad => ad["tags"][0]["tagName"] == "Bank Card");
  
  if (theresDiscounts) {
    var output = new Array();
    ads.forEach((ad) => {
      if (ad["tags"][0]["tagName"] == "Bank Card" 
          && (ad["title"].includes("OCBC") ||ad["title"].includes("DBS/POSB"))) {
            const disc = {"title": ad["title"],
                          "description": ad["introduction"],
                          "pageLink": ad["pageLink"]}
            output.push(disc);
          }
    }) 
    console.log(output);
  }
  else console.log(null);
});