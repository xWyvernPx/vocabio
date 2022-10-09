const mongoose = require("mongoose");
const { Types } = require("mongoose");
const deckSchema = new mongoose.Schema(
  {
    account: {
      type: Types.ObjectId,
      ref: "account",
    },
    learned: [String],
    learning: [
      {
        type: Types.ObjectId,
        ref: "wordindeck",
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("deck", deckSchema);
