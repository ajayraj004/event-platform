const axios = require("axios");
const cheerio = require("cheerio");
const Event = require("../models/Event");

module.exports = async function scrapeMeetup() {
  const url = "https://www.meetup.com/find/?location=au--Sydney";
  const { data } = await axios.get(url);
  const $ = cheerio.load(data);

  for (const el of $("a.eventCard").toArray()) {
    const title = $(el).text().trim();
    const link = $(el).attr("href");

    if (!title || !link) continue;

    const sourceUrl = "https://www.meetup.com" + link;

    await Event.findOneAndUpdate(
      { sourceUrl },
      {
        title,
        sourceUrl,
        source: "Meetup",
        city: "Sydney",
        lastScrapedAt: new Date(),
        status: "new",
      },
      { upsert: true }
    );
  }

  console.log("Meetup scrape completed");
};
