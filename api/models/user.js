const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    type: {
      type: Number,
      required: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    password: String,
    first_name: String,
    last_name: String,
    driving_license: String,
    date_of_birth: Date,
    city: String,
    country: String,
    profile_photo: String,
    license_photo: String,
    rating: { type: Number, default: null },
    rating_count: { type: Number, default: null },
    available: Boolean,
    approved: Boolean,
    vehicles: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Vehicle" }],
      default: undefined,
    },
    last_booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      default: null,
    },
  },
  { collation: { locale: "en", strength: 2 }, timestamps: true },
);

module.exports = mongoose.model("User", userSchema);
