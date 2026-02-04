const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },

    datetime: { type: Date, required: true },

    venue: { type: String, trim: true },

    address: { type: String, trim: true },

    city: { type: String, default: "Sydney", index: true },

    description: { type: String, trim: true },

    category: { type: String, trim: true },

    imageUrl: { type: String, trim: true },

    source: { type: String, trim: true },

    sourceUrl: { type: String, trim: true },

    status: {
      type: String,
      enum: ["new", "updated", "inactive", "imported"],
      default: "new",
      index: true,
    },

    lastScrapedAt: { type: Date, default: Date.now },

    importedAt: { type: Date, default: null },

    importedBy: { type: String, default: null },

    importNotes: { type: String, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Event", EventSchema);
