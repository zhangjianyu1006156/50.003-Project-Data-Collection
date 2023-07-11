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

  async scrapeTripComBD() {
    await page.setRequestInterception(true);
    let dataTripComBD = '';
    page.on('request', async (interceptedRequest) => {
      if (
        interceptedRequest.method().includes('POST') &&
        interceptedRequest.url().includes('/queryAdsDisplayData')
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
      if (response.url().includes('/queryAdsDisplayData')) {
        await page.waitForTimeout(2000);
        try {
          dataTripComBD = await response.json();
        } catch (error) {}
      }
    });

    await page.goto('https://sg.trip.com/sale/deals/');
    await page.waitForTimeout(5000);

    ads = dataTripComBD["adsWidgetDataTypes"][0]["adsDisplayDataTypes"] 
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
      return(output);
    }
    else return(null);
  }

  

  async scrape(provider, prod_id, page) {
    switch (provider) {
      case 'kkdays':
        return await this.scrapeKKDays(prod_id, page);
      case 'tripcom':
        return await this.scrapeTripCom(prod_id, page);
      case 'tripcomBD':
        return await this.scrapeTripComBD()
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