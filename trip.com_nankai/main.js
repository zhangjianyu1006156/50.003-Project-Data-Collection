const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');

puppeteer.use(StealthPlugin());

async function scrapeProduct(url) {
  var data = ""
  const browser = await puppeteer.launch({ headless: true, ignoreHTTPSErrors: true });
  const page = await browser.newPage();
  
  await page.setRequestInterception(true);

  page.on('request', async (interceptedRequest) => {
    if (interceptedRequest.method().includes('POST') && interceptedRequest.url().includes('/getProductPriceCalendar')){
      
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
    if(response.url().includes('/getProductPriceCalendar')){
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
const productUrl = "https://sg.trip.com/things-to-do/detail/20557692" 

scrapeProduct(productUrl).then((data) => {
  prodName = data['data']['packageInfos']['0']['packageName'];
  minPrice = data['data']['packageInfos']['0']['resourceInfos']['0']['minPrice'];
  marketPrice = data['data']['packageInfos']['0']['resourceInfos']['0']['marketPrice'];

  console.log('Product Name: ', prodName);
  console.log('Min Price: ', minPrice);
  console.log('Market Price: ', marketPrice);
});


