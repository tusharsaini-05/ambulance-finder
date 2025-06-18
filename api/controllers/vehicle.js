const Vehicle = require("../models/vehicle");
const User = require("../models/user");

exports.create_vehicle = (req, res) => {
  req.body.vehicle_photo = req.file.filename;
  req.body.features = JSON.parse(req.body.features);

  const vehicle = new Vehicle({ ...req.body });
  vehicle
    .save()
    .then((vehicle) => {
      // save vehicle data to user collection
      User.updateOne(
        { _id: vehicle.user_id },
        { $push: { vehicles: vehicle._id } },
      )
        .then((response) => {
          res.status(201).json({ message: "Registered successfully" });
        })
        .catch(() => {
          res.status(500).json({ message: "Registration failed" });
        });
    })
    .catch(() => {
      res.status(500).json({ message: "Server error" });
    });
};
exports.update_vehicle = (req, res) => {
  req.file ? (req.body.vehicle_photo = req.file.filename) : null;
  req.body.features = JSON.parse(req.body.features);

  Vehicle.updateOne({ _id: req.body.vehicleId }, { $set: req.body })
    .then(() => {
      res.status(200).json({ message: "Updated successfully" });
    })
    .catch(() => {
      res.status(500).json({ message: "Update failed" });
    });
};
exports.get_vehicles_by_user_id = (req, res) => {
  Vehicle.find({ user_id: req.userId })
    .populate("user_id", "approved vehicles")
    .then((vehicles) => {
      if (vehicles) {
        res.status(200).send(vehicles);
      } else {
        res.status(400).json({ message: "No vehicles found" });
      }
    })
    .catch((err) => {
      res.status(500).json({ message: "Server error" });
    });
};
exports.get_vehicle_by_id = (req, res) => {
  Vehicle.findOne({ _id: req.body.vehicleId })
    .then((vehicle) => {
      if (vehicle) {
        res.status(200).send(vehicle);
      } else {
        res.status(400).json({ message: "No vehicle found" });
      }
    })
    .catch((err) => {
      res.status(500).json({ message: "Server error" });
    });
};
