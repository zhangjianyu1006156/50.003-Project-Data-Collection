import { WebScrapper } from './WebScrapper.js';

async function main() {
  const web_scrapper = new WebScrapper();
  const scraping_obj = await web_scrapper.spawn();
  const price = await web_scrapper.scrape('tripcom', 20557692, scraping_obj[0]);
  await web_scrapper.close(scraping_obj[1]);
  return price;
}

main().then((price) => {
  console.log(price);
});
