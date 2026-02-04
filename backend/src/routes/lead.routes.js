const router = require("express").Router();
const Lead = require("../models/Lead");

router.post("/", async (req, res) => {
  await Lead.create(req.body);
  res.json({ success: true });
});

module.exports = router;
