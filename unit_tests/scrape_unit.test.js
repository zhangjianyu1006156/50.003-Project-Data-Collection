import { scrapeTripcom, scrapeKKdays } from "./scrapeFunctions";
import tripcomNankaiData from "./testData/Tripcom_Nankai.json" assert {"type":"json"};
import tripcomFujiQData from "./testData/Tripcom_FujiQ.json" assert {"type":"json"};
import KKDaysNankaiData from "./testData/KKDays_Nankai.json" assert {"type":"json"};
import KKDaysFujiQData from "./testData/KKDays_FujiQ.json" assert {"type":"json"};

describe("Test web scrapers for Tripcom:", () => {
    test ("scraping Nankai data", async () => {
        const data = scrapeTripcom(tripcomNankaiData)
        
        expect(data["minPrice"]).toBe(10.36);
        expect(data["marketPrice"]).toBe(13.19);
    });

    test ("scraping FujiQ data", async () => {
        const data = scrapeTripcom(tripcomFujiQData)
        
        expect(data["minPrice"]).toBe(0);
        expect(data["marketPrice"]).toBe(0);
    });
})

describe("Test web scrapers for KKDays:", () => {
    test ("scraping Nankai data", async () => {
        const data = scrapeKKdays(KKDaysNankaiData, '354751')
        
        expect(data["minPrice"]).toBe(10.34);
        expect(data["maxPrice"]).toBe(10.34);
    });

    test ("scraping FujiQ data", async () => {
        const data = scrapeKKdays(KKDaysFujiQData, '378918')

        expect(data["minPrice"]).toBe(48.87);
        expect(data["maxPrice"]).toBe(64.85);
    });
})
