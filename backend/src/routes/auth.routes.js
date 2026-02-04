const router = require("express").Router();
const passport = require("passport");

router.get("/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get("/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => res.redirect("http://localhost:5173/dashboard")
);

router.get("/me", (req, res) => {
  res.json(req.user || null);
});

module.exports = router;
