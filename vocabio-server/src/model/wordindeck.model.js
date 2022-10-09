const mongoose = require("mongoose");

const wordInDeckSchema = new mongoose.Schema({
  word: String,
  reviewLevel: Number,
  nextReview: Date,
});
module.exports = mongoose.model("wordindeck", wordInDeckSchema);
