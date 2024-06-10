import axios from "axios";
import { Cheerio } from "cheerio";

const extractData = async (area, industry) => {
  const url = `https://www.justdial.com/${area}/${industry}`;

  try {
    const { data } = await axios.get(url);
    const $ = Cheerio.load(data);
    const results = [];

    $(`.store-details`).each((index, element) => {
      const name = $(element).find(`.store-name`).text().trim();
      const phone = $(element).find(`.contact-info`).text().trim();
      if (name && phone) {
        results.push({ name, phone });
      }
    });

    return results;
  } catch (error) {
    console.error(`error fetching data: ${error}`);
    return [];
  }
};

module.exports = extractData;
