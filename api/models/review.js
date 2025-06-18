const mongoose = require("mongoose");

const reviewSchema = mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    rating: { type: Number, required: true },
    details: { type: String, required: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Review", reviewSchema);
