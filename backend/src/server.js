require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

console.log("🔥 CLEAN SERVER START 🔥");

const app = express();
app.use(cors());
app.use(express.json());


mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => {
    console.error(err);
    process.exit(1);
  });


const Event = require("./models/Event");
const Lead = require("./models/Lead");


app.get("/api/events", async (req, res) => {
  const events = await Event.find()
    .sort({ createdAt: -1 });

  res.json(events);
});


app.patch("/api/events/:id/import", async (req, res) => {
  const event = await Event.findById(req.params.id);

  if (!event) {
    return res.status(404).json({ message: "Event not found" });
  }

  event.status = "imported";
  event.importedAt = new Date();
  event.importedBy = "admin"; // mock reviewer

  await event.save();

  res.json(event);
});


app.post("/api/scrape", async (req, res) => {
  const scrapedEvents = [
    {
      title: "Tech Conference 2026",
      datetime: new Date("2026-03-15T10:00:00"),
      venue: "ICC Sydney",
      address: "14 Darling Dr, Sydney",
      city: "Sydney",
      description: "Annual technology conference",
      category: "Technology",
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

  res.json({ success: true, message: "Scrape completed" });
});

app.post("/api/leads", async (req, res) => {
  const { email, consent, eventId } = req.body;

  if (!email || !consent || !eventId) {
    return res.status(400).json({ message: "Invalid data" });
  }

  await Lead.create({ email, consent, eventId });

  res.json({ success: true });
});

app.listen(5050, () => {
  console.log("Backend running on http://localhost:5050");
});


