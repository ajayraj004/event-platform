const express = require("express");
const router = express.Router();
const Event = require("../models/Event");

router.get("/", async (req, res) => {
  const events = await Event.find().sort({ createdAt: -1 });
  res.json(events);
});

router.patch("/:id/import", async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) return res.status(404).json({ error: "Event not found" });

  event.status = "imported";
  event.importedAt = new Date();
  event.importedBy = "admin"; // mock reviewer
  await event.save();

  res.json(event);
});

module.exports = router;
