const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const { start } = require('repl');

puppeteer.use(StealthPlugin());

async function scrapeProduct(url) {
  var responseData = [];
  const browser = await puppeteer.launch({ headless: true, ignoreHTTPSErrors: true });
  const page = await browser.newPage();
  
  await page.setRequestInterception(true);

  page.on('request', async (interceptedRequest) => {
    if (interceptedRequest.method().includes('POST') 
        && interceptedRequest.url().includes('/getCommonCouponInfoList')){
      
      const methods = interceptedRequest.method();
      const headerss = interceptedRequest.headers();
      const postDatas = interceptedRequest.postData();
      
      //modify request payload
      interceptedRequest.continue({method: methods, postData : postDatas, headers:headerss});

    } else {
      interceptedRequest.continue();
    }
  })
  
  const responsePromises = []; 

  page.on('response', async (response) => {
    if(response.url().includes('/getCommonCouponInfoList')){
      const responsePromise = response.json().then(jsonData => {
        responseData.push(jsonData);
      }).catch(error => {
        console.error('Error parsing JSON:', error);
      });

      responsePromises.push(responsePromise);
    }
  });

  await page.goto(url);
  await page.waitForTimeout(5000);
  await Promise.all(responsePromises); //wait for all responses
  await browser.close();

  return responseData;
}

//plug in product url
const productUrl = "https://sg.trip.com/sale/w/4139/uob.html?locale=en_sg&curr=sgd&promo_referer=409_4139_11" 

scrapeProduct(productUrl).then((responseData) => { 
  let maxVal = 0;
  let couponLeft = 0;
  responseData.forEach((data) => {
    coupons = data["promotionStrategyList"]
    coupons.forEach((coupon) => {
      if (coupon['couponAmount'] > maxVal && coupon['userProductLineId'] == 20) {
        maxVal = coupon['couponAmount'];
        couponLeft = coupon['couponLeft'];
      }
    }) 
  })
  console.log({maxVal : maxVal * -1, couponLeft: couponLeft});
});
