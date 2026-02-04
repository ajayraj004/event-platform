const axios = require("axios");
const cheerio = require("cheerio");
const Event = require("../models/Event");

module.exports = async function scrapeEventbrite() {
  const url = "https://www.eventbrite.com/d/australia--sydney/events/";
  const { data } = await axios.get(url);
  const $ = cheerio.load(data);

  for (const el of $(".search-event-card-wrapper").toArray()) {
    const title = $(el).find("h3").text().trim();
    const sourceUrl = $(el).find("a").attr("href");

    if (!title || !sourceUrl) continue;

    await Event.findOneAndUpdate(
      { sourceUrl },
      {
        title,
        sourceUrl,
        source: "Eventbrite",
        city: "Sydney",
        lastScrapedAt: new Date(),
        status: "new", // overwritten automatically if exists
      },
      { upsert: true }
    );
  }

  console.log("Eventbrite scrape completed");
};
