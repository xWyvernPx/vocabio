const mongoose = require("mongoose");
const wordLibSchema = new mongoose.Schema({
  name: String,
});
const wordLibModel = mongoose.model("wordlib", wordLibSchema);

module.exports = wordLibModel;
