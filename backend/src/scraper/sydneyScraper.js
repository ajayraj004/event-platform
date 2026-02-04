const axios = require("axios");
const cheerio = require("cheerio");
const Event = require("../models/Event");

async function scrapeSydneyEvents() {
  const url =
    "https://www.eventbrite.com.au/d/australia--sydney/events/";

  const { data } = await axios.get(url);
  const $ = cheerio.load(data);

  const scrapedEvents = [];

  $(".search-event-card-wrapper").each((_, el) => {
    const title = $(el).find("h3").text().trim();
    const link = $(el).find("a").attr("href");

    if (title && link) {
      scrapedEvents.push({
        title,
        sourceUrl: link,
        source: "Eventbrite",
        city: "Sydney",
      });
    }
  });

  for (const e of scrapedEvents) {
    const existing = await Event.findOne({ sourceUrl: e.sourceUrl });

    if (!existing) {
      await Event.create({
        ...e,
        status: "new",
        lastScrapedAt: new Date(),
      });
    }
  }

  console.log("Scraping complete");
}

module.exports = scrapeSydneyEvents;
