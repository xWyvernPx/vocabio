const googleRoute = require("./auth/google/google.route");
module.exports = (app) => {
  app.use("/oauth/google", googleRoute);
};
