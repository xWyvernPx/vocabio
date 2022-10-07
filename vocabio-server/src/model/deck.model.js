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
        word: String,
        reviewLevel: Number,
        nextReview: Date,
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("deck", deckSchema);
