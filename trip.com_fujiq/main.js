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
        && interceptedRequest.url().includes('/getProductInfo?_fxpcq')){
      
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
    if(response.url().includes('/getProductInfo?_fxpcq')){
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
const productUrl = "https://sg.trip.com/things-to-do/detail/37160766" 

scrapeProduct(productUrl).then((data) => {
  prodName = data['productInfos']['0']['basicInfo']['productName'];
  minPrice = data['productInfos']['0']['basicInfo']['minPrice'];
  marketPrice = data['productInfos']['0']['basicInfo']['marketPrice'];
  
  console.log('Product Name: ', prodName);
  console.log('Min Price: ', minPrice);
  console.log('Market Price: ', marketPrice);
});