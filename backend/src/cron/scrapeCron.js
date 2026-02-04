const cron = require("node-cron");
const scrapeEventbrite = require("../scraper/eventbrite");
const scrapeMeetup = require("../scraper/meetup");
const Event = require("../models/Event");


cron.schedule("0 */6 * * *", async () => {
  console.log("⏳ Running scheduled event scraping...");

  try {
    
    await scrapeEventbrite();
    await scrapeMeetup();

    
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    await Event.updateMany(
      {
        lastScrapedAt: { $lt: sevenDaysAgo },
        status: { $ne: "imported" }, 
      },
      {
        status: "inactive",
      }
    );

    console.log(" Scraping + cleanup completed");
  } catch (error) {
    console.error(" Scraping cron failed:", error.message);
  }
});
