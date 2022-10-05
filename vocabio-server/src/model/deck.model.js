const mongoose = require("mongoose");
const { Types } = require("mongoose");
const deckSchema = new mongoose.Schema(
  {
    account: {
      type: mongoose.Types.ObjectId,
    },
    learned: [mongoose.Types.ObjectId],
    learning: [
      {
        word: mongoose.Types.ObjectId,
        reviewLevel: Number,
        nextReview: Date,
      },
    ],
  },
  {
    timestamps,
  }
);

module.exports = mongoose.model("deck", deckSchema);
