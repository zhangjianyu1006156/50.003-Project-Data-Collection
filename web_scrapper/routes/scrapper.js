import express from "express"
export const router = express.Router();
import { ProductModel } from "../models/products.js"
import { PlatformModel } from "../models/platforms.js"
import { WebScrapper } from "../src/WebScrapper.js"

router.get('/update_products', async (req, res) => {
    try {
      const web_scrapper = new WebScrapper();
      const scraping_obj1 = await web_scrapper.spawn();
      const price_tripcom_nk = await web_scrapper.scrape('tripcom', 20557692, scraping_obj1[0]);
      await web_scrapper.close(scraping_obj1[0])
      const scraping_obj2 = await web_scrapper.spawn();
      const price_tripcom_fq = await web_scrapper.scrape('tripcom', 37160766, scraping_obj2[0]);
      await web_scrapper.close(scraping_obj2[0])
      const scraping_obj3 = await web_scrapper.spawn();
      const price_kkdays_nk = await web_scrapper.scrape('kkdays', 354751, scraping_obj3[0]);
      await web_scrapper.close(scraping_obj3[0])
      const scraping_obj4 = await web_scrapper.spawn();
      const price_kkdays_fq = await web_scrapper.scrape('kkdays', 378918, scraping_obj4[0]);
      await web_scrapper.close(scraping_obj4[0])

      await ProductModel.findOneAndUpdate(
        {
          product_id: "rCl2yVo6KjgZatQA"
        },
        {
          kkdays_price: price_kkdays_fq,
          tripcom_price: price_tripcom_fq
        }
      )
      
      await ProductModel.findOneAndUpdate(
        {
          product_id: "pBVQUE2TsOCrdA4L"
        },
        {
          kkdays_price: price_kkdays_nk,
          tripcom_price: price_tripcom_nk
        }
      )

      res.status(200).json("Updated");
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
});

router.get('/update_platforms', async (req, res) => {
    try {
      const web_scrapper = new WebScrapper();
      const scraping_obj1 = await web_scrapper.spawn();
      const price_tripcom_ocbc = await web_scrapper.scrape('tripcomBD', "OCBC", scraping_obj1[0]);
      await web_scrapper.close(scraping_obj1[0]);
      const scraping_obj2 = await web_scrapper.spawn();
      const price_tripcom_dbs = await web_scrapper.scrape('tripcomBD', "DBS/POSB", scraping_obj2[0]);
      await web_scrapper.close(scraping_obj2[0]);
      const scraping_obj3 = await web_scrapper.spawn();
      const price_kkdays_ocbc = await web_scrapper.scrape('kkdaysBD', "ocbc", scraping_obj3[0]);
      await web_scrapper.close(scraping_obj3[0]);
      const scraping_obj4 = await web_scrapper.spawn();
      const price_kkdays_hsbc = await web_scrapper.scrape('kkdaysBD', "hsbc", scraping_obj4[0]);
      await web_scrapper.close(scraping_obj4[0]);
      const scraping_obj5 = await web_scrapper.spawn();
      const price_kkdays_uob = await web_scrapper.scrape('kkdaysBD', "uob", scraping_obj5[0]);
      await web_scrapper.close(scraping_obj5[0]);

      let biggest_discount_tripcom = 0
      try{
        biggest_discount_tripcom = Math.max(price_tripcom_ocbc.maxVal, price_tripcom_dbs.maxVal)
      }catch(e){
        biggest_discount_tripcom = 0
      }
      const doc1 = await PlatformModel.findOneAndUpdate(
        {
          name: "tripcom"
        },
        {
          biggest_discount: biggest_discount_tripcom
        }
      )

      let biggest_discount_kkdays = 0
      try{
        biggest_discount_kkdays = Math.max(price_kkdays_ocbc, price_kkdays_hsbc, price_kkdays_uob)
      }catch(e){
        biggest_discount_kkdays = 0
      }
      
      const doc2 = await PlatformModel.findOneAndUpdate(
        {
          name: "kkdays"
        },
        {
          biggest_discount: biggest_discount_kkdays
        }
      )

      res.status(200).json("Updated");
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
});