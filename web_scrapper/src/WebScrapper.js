import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import puppeteer from 'puppeteer-extra';

export class WebScrapper {

  static instance = null;

  constructor() {}

  static initialise() {
    if (!WebScrapper.instance) {
      WebScrapper.instance = new WebScrapper();
    }
    return WebScrapper.instance;
  }

  async spawn(){
    puppeteer.use(StealthPlugin());
    const browser = await puppeteer.launch({ headless: true, ignoreHTTPSErrors: true })
    const page = await browser.newPage()
    return [page, browser]
  }

  async scrapeKKDays(prod_id, page) {
    const kkdays_data = [
      {
        prod_id: 378918,
        prod_name:
          'https://www.kkday.com/en-sg/product/ajax_get_packages_data?prodMid=20133&previewToken=&beginDate=2023-06-12&endDate=2024-03-31'
      },
      {
        prod_id: 354751,
        prod_name:
          'https://www.kkday.com/en-sg/product/ajax_get_packages_data?prodMid=19691&previewToken=&beginDate=2023-06-12&endDate=2024-03-31'
      }
    ];

    await page.goto(
      kkdays_data.find((product) => product.prod_id === prod_id).prod_name
    );
    const data = await page.evaluate(() => document.body.textContent);
    const min_price = data['data']['PACKAGE'][String(prod_id)]['sale_price'][
      'min_price'
    ]
      ? data['data']['PACKAGE'][String(prod_id)]['sale_price']['min_price']
      : Infinity;
    const max_price = data['data']['PACKAGE'][String(prod_id)]['sale_price'][
      'max_price'
    ]
      ? data['data']['PACKAGE'][String(prod_id)]['sale_price']['max_price']
      : Infinity;
    const official_price = data['data']['PACKAGE'][String(prod_id)]['sale_price'][
      'official_price'
    ]
      ? data['data']['PACKAGE'][String(prod_id)]['sale_price']['official_price']
      : Infinity;
    return String(Math.min(min_price, max_price, official_price));
  }

  async scrapeTripCom(prod_id, page) {
    const tripcom_data = [
      {
        prod_id: 20557692,
        prod_name: 'https://sg.trip.com/things-to-do/detail/20557692'
      },
      {
        prod_id: 37160766,
        prod_name: 'https://sg.trip.com/things-to-do/detail/37160766'
      }
    ];
    await page.setRequestInterception(true);
    let dataTripCom = '';
    page.on('request', async (interceptedRequest) => {
      if (
        interceptedRequest.method().includes('POST') &&
        interceptedRequest.url().includes('/getProductInfo?_fxpcq')
      ) {
        const methods = interceptedRequest.method();
        const headerss = interceptedRequest.headers();
        const postDatas = interceptedRequest.postData();

        interceptedRequest.continue({
          method: methods,
          postData: postDatas,
          headers: headerss
        });
      } else {
        interceptedRequest.continue();
      }
    });

    page.on('response', async (response) => {
      if (response.url().includes('/getProductInfo?_fxpcq')) {
        await page.waitForTimeout(2000);
        try {
          dataTripCom = await response.json();
        } catch (error) {}
      }
    });

    await page.goto(
      tripcom_data.find((product) => product.prod_id === prod_id).prod_name
    );
    await page.waitForTimeout(5000);

    return String(dataTripCom['productInfos']['0']['basicInfo']['minPrice']);
  }

  async scrapeTripComBD(card_name, page) {
    const tripcom_data = [
      {
        card_name: "DBS/POSB",
        url: 'https://sg.trip.com/sale/w/4193/dbs.html?locale=en_sg&curr=sgd&promo_referer=409_4193_9'
      },
      {
        card_name: "OCBC",
        url: 'https://sg.trip.com/sale/w/2952/ocbc.html?locale=en_sg&curr=sgd&promo_referer=409_2952_10'
      }
    ];

    await page.setRequestInterception(true);
    let dataTripComBD = [];
    page.on('request', async (interceptedRequest) => {
      if (
        interceptedRequest.method().includes('POST') &&
        interceptedRequest.url().includes('/getCommonCouponInfoList')
      ) {
        const methods = interceptedRequest.method();
        const headerss = interceptedRequest.headers();
        const postDatas = interceptedRequest.postData();

        interceptedRequest.continue({
          method: methods,
          postData: postDatas,
          headers: headerss
        });
      } else {
        interceptedRequest.continue();
      }
    });

    const responsePromises = []; 

    page.on('response', async (response) => {
      if(response.url().includes('/getCommonCouponInfoList')){
        const responsePromise = response.json().then(jsonData => {
          dataTripComBD.push(jsonData);
        }).catch(error => {
          console.error('Error parsing JSON:', error);
        });
  
        responsePromises.push(responsePromise);
      }
    });
  
    await page.goto(
      tripcom_data.find((card) => card.card_name === card_name).url
    );
    await page.waitForTimeout(5000);
    await Promise.all(responsePromises); //wait for all responses
    await browser.close();
  
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
    return {maxVal : maxVal * -1, couponLeft: couponLeft};
  }

  

  async scrape(provider, prod_id, page) {
    switch (provider) {
      case 'kkdays':
        return await this.scrapeKKDays(prod_id, page);
      case 'tripcom':
        return await this.scrapeTripCom(prod_id, page);
      case 'tripcomBD':
        return await this.scrapeTripComBD(card_name, page);
      default:
        return '404 Error';
    }
  }

  static flush() {
    WebScrapper.instance = null;
  }

  async close(browser) {
    await browser.close();
    WebScrapper.flush();
  }
}