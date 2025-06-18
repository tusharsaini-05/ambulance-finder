const Booking = require("../models/booking");

exports.book_driver = (req, res) => {
  const booking = new Booking({
    ...req.body,
    ...{ client: req.userId },
    ...{ status: 0 },
  });
  booking
    .save()
    .then((booking) => {
      res.status(201).json({ message: "Booking successful", booking });
    })
    .catch(() => {
      res.status(500).json({ message: "Booking failed" });
    });
};
exports.find_bookings_by_user_id = (req, res) => {
  let type, populateField, selectedFields;

  if (req.query.userType == 0) {
    type = "client";
    populateField = "driver";
    selectedFields = "first_name";
  } else {
    type = "driver";
    populateField = "client";
    selectedFields = "phone";
  }
  Booking.find({ [type]: req.userId })
    .populate(populateField, selectedFields)
    .then((bookings) => res.status(200).send(bookings))
    .catch(() => res.status(500).json({ message: "Server error" }));
};
exports.find_booking_vehicle_by_booking_id = (req, res) => {
  const bookingId = req.query.bookingId;
  Booking.findOne({ _id: bookingId })
    .populate({
      path: "driver",
      select: "-password",
      populate: { path: "vehicles", select: "_id name cost" },
    })
    .populate("client", "-password")
    .then((booking) => res.status(200).send(booking))
    .catch(() => res.status(500).json({ message: "Server error" }));
};
exports.update_status = (req, res) => {
  const bookingId = req.query.bookingId;
  const newStatus = req.query.newStatus;

  Booking.updateOne({ _id: bookingId }, { $set: { status: newStatus } })
    .then(() => res.status(200).json({ message: "Updated successfully" }))
    .catch(() => res.status(500).json({ message: "Server error" }));
};
