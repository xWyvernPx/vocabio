const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const app = express();
const passport = require("passport");
const expressSession = require("express-session");
const Router = require("./route/index.route");
const reviewLevelModel = require("./model/reviewLevel.model");
const levels = require("./helper/mockLevelData");
require("./middleware/passport");

app.use(
  expressSession({
    secret: "key",
    name: "sid",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true },
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:1212",
  })
);
app.use(helmet());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

Router(app);

module.exports = app;
