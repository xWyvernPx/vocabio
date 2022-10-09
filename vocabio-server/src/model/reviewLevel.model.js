const { model, Schema } = require("mongoose");

const reviewLevelSchema = new Schema({
  level: {
    type: Number,
  },
  reviewAfterPeriod: Number, // number of days
});

module.exports = model("reviewLevel", reviewLevelSchema);
