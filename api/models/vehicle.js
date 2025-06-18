const mongoose = require("mongoose");

const vehicleSchema = mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  name: {
    type: String,
    required: true,
  },
  type: {
    type: Number,
    required: true,
  },
  cost: {
    type: Number,
    required: true,
  },
  number_plate: {
    type: String,
    required: true,
  },
  seat: { type: Number, required: true },
  features: {
    wheelchair: { type: Boolean, required: true },
    oxygen: { type: Boolean, required: true },
    stretcher: { type: Boolean, required: true },
  },
  vehicle_photo: { type: String, required: true },
});

module.exports = mongoose.model("Vehicle", vehicleSchema);
