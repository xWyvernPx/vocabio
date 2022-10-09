const mongoose = require("mongoose");

const wordSchema = new mongoose.Schema({
  name: String,
  desc: String,
  lexicalCategory: String,
  pronunciation: {
    file: { type: String, required: false },
    read: { type: String, required: false },
  },
});

module.exports = mongoose.model("word", wordSchema);
