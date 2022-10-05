const mongoose = require("mongoose");

const accountSchema = new mongoose.Schema({
  username: String,
  password: String,
  avatar: String,
  email: String,
  oauth: {
    google: {
      type: String,
      required: false,
    },
    facebook: {
      type: String,
      required: false,
    },
  },
});

module.exports = mongoose.model("account", accountSchema);
