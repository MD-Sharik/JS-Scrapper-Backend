const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");

puppeteer.use(StealthPlugin());

const extractData = async (area, industry) => {
  const url = `https://www.justdial.com/${area}/${industry}`;
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--disable-http2"],
  });
  const page = await browser.newPage();

  try {
    await page.setExtraHTTPHeaders({
      "Upgrade-Insecure-Requests": "1",
    });

    await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 }); // Increased timeout to 60 seconds

    // Scroll a bit to ensure initial dynamic content loads
    await page.evaluate(() => {
      window.scrollBy(0, 10000);
    });

    // Wait for the results to load
    await page.waitForSelector(".resultbox_textbox", { timeout: 60000 }); // Increased timeout to 60 seconds

    const results = await page.evaluate(() => {
      const data = [];
      const items = document.querySelectorAll(".resultbox_textbox");
      items.forEach((item, index) => {
        if (index < 400) {
          // Limit to first 40 results
          const name = item
            .querySelector(".resultbox_title_anchor")
            ?.innerText.trim();
          const phone = item
            .querySelector(".callNowAnchor .callcontent")
            ?.innerText.trim();

          if (name && phone) {
            data.push({ name, phone });
          }
        }
      });
      return data;
    });

    console.log(results); // For debugging
    return results;
  } catch (error) {
    console.error(`Error fetching data: ${error}`);
    return [];
  } finally {
    await page.close();
    await browser.close();
  }
};

module.exports = extractData;
