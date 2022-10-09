const express = require("express");
const passport = require("passport");
const googleRoute = express.Router();
googleRoute.get(
  "/",
  passport.authenticate("google", {
    session: true,
    scope: ["profile", "email"],
  })
);
googleRoute.get(
  "/callback",
  passport.authenticate("google", {
    session: true,
    successRedirect: "https://facebook.com",
  })
);
module.exports = googleRoute;
