import express from "express";
import { document } from "../utilities/document.js";
import puppeteer from "puppeteer";

const router = express.Router();

router.post("/generate-pdf", async (req, res) => {
    const { order_id } = req.body;
  
    try {
      const browser = await puppeteer.launch({'headless': true,  args: [
        "--disable-setuid-sandbox",
        "--no-sandbox",
        "--single-process",
        "--no-zygote"
      ],executablePath: process.env.PUPPETEER_EXECUTABLE_PATH,
      });
      const page = await browser.newPage();
      await page.evaluateHandle('document.fonts.ready');
      await page.setUserAgent("Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36")

      await page.setContent(await document(order_id));
  
      const pdfBuffer = await page.pdf({
        'format': 'A4'
      });
      await browser.close();
  
      res.contentType('application/pdf');
      res.send(pdfBuffer);
    } catch (error) {
      console.error('Error generating PDF:', error);
      res.status(500).send('Error generating PDF');
    }
  })

export default router;