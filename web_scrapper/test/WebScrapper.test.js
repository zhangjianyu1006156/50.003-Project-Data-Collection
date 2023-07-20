const {WebScrapper} = require("../src/WebScrapper");

describe("Test web scrapers for KKDays products:", () => {
    const web_scrapper = new WebScrapper();

    test ("WS_KKD_FQ: scraping Fuji-Q ticket min price", async () => {
        const scraping_obj = await web_scrapper.spawn();
        const price = await web_scrapper.scrape('kkdays', 378918, scraping_obj[0]);
        await web_scrapper.close(scraping_obj[1]);

        expect(typeof price).toBe('number');
    });

    test ("WS_KKD_NK: scraping Nankai ticket min price", async () => {
        const scraping_obj = await web_scrapper.spawn();
        const price = await web_scrapper.scrape('kkdays', 354751, scraping_obj[0]);
        await web_scrapper.close(scraping_obj[1]);

        expect(typeof price).toBe('number');
    });    
})

describe("Test web scrapers for KKDays discounts:", () => {
    const web_scrapper = new WebScrapper();

    test ("WS_KKD_BD: scraping for OCBC discounts", async () => {
        const scraping_obj = await web_scrapper.spawn();
        const disc = await web_scrapper.scrape('kkdaysBD', 'OCBC', scraping_obj[0]);
        await web_scrapper.close(scraping_obj[1]);

        expect(typeof disc).toBe('number');
    });

    test ("WS_KKD_BD: scraping for UOB discounts", async () => {
        const scraping_obj = await web_scrapper.spawn();
        const disc = await web_scrapper.scrape('kkdaysBD', 'UOB', scraping_obj[0]);
        await web_scrapper.close(scraping_obj[1]);

        expect(typeof disc).toBe('number');
    });

    test ("WS_KKD_BD: scraping for HSBC discounts", async () => {
        const scraping_obj = await web_scrapper.spawn();
        const disc = await web_scrapper.scrape('kkdaysBD', 'HSBC', scraping_obj[0]);
        await web_scrapper.close(scraping_obj[1]);

        expect(typeof disc).toBe('number');
    });
    
})

describe("Test web scrapers for Trip.com products:", () => {
    const web_scrapper = new WebScrapper();

    test ("WS_TC_FQ: scraping Fuji-Q ticket min price", async () => {
        const scraping_obj = await web_scrapper.spawn();
        const price = await web_scrapper.scrape('tripcom', 20557692, scraping_obj[0]);
        await web_scrapper.close(scraping_obj[1]);

        expect(typeof price).toBe('number');
    });

    test ("WS_TC_NK: scraping Nankai ticket min price", async () => {
        const scraping_obj = await web_scrapper.spawn();
        const price = await web_scrapper.scrape('tripcom', 37160766, scraping_obj[0]);
        await web_scrapper.close(scraping_obj[1]);

        expect(typeof price).toBe('number');
    });    
})

describe("Test web scrapers for Trip.com discounts:", () => {
    const web_scrapper = new WebScrapper();

    test ("WS_KKD_BD: scraping for OCBC discounts", async () => {
        const scraping_obj = await web_scrapper.spawn();
        const disc = await web_scrapper.scrape('tripcomBD', 'OCBC', scraping_obj[0]);
        await web_scrapper.close(scraping_obj[1]);

        expect(typeof disc).toBe('object');
        expect(typeof disc['maxVal']).toBe('number')
    });

    test ("WS_KKD_BD: scraping for DBS/POSB discounts", async () => {
        const scraping_obj = await web_scrapper.spawn();
        const disc = await web_scrapper.scrape('tripcomBD', 'DBS/POSB', scraping_obj[0]);
        await web_scrapper.close(scraping_obj[1]);

        expect(typeof disc).toBe('object');
        expect(typeof disc['maxVal']).toBe('number')
    });
    
})
    
    
    
