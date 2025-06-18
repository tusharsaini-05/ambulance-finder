const mongoose = require("mongoose");

const bookingSchema = mongoose.Schema(
  {
    pickup: { type: String, required: true },
    destination: { type: String, required: true },
    driver: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    client: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    status: { type: Number, required: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Booking", bookingSchema);
