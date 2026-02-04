const express = require("express");
const router = express.Router();
const Event = require("../models/Event");

router.post("/", async (req, res) => {
  const scrapedEvents = [
    {
      title: "Tech Conference 2026",
      datetime: new Date("2026-03-15T10:00:00"),
      venue: "ICC Sydney",
      city: "Sydney",
      description: "Annual technology conference",
      source: "MockScraper",
      sourceUrl: "https://example.com/tech-conf",
    },
  ];

  await Event.updateMany(
    { status: { $ne: "imported" } },
    { status: "inactive" }
  );

  for (const scraped of scrapedEvents) {
    const existing = await Event.findOne({
      title: scraped.title,
      source: scraped.source,
    });

    if (!existing) {
      await Event.create({
        ...scraped,
        status: "new",
        lastScrapedAt: new Date(),
      });
    } else {
      const changed =
        existing.venue !== scraped.venue ||
        existing.datetime.getTime() !== scraped.datetime.getTime();

      existing.status = changed ? "updated" : existing.status;
      existing.lastScrapedAt = new Date();
      await existing.save();
    }
  }

  res.json({ message: "Scrape completed successfully" });
});

module.exports = router;
