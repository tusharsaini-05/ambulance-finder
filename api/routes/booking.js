const router = require("express").Router();
const bookingController = require("../controllers/booking");
const authToken = require("../middlewares/auth-token");

router.post("/bookDriver", authToken, bookingController.book_driver);
router.get(
  "/findBookingsByUserId",
  authToken,
  bookingController.find_bookings_by_user_id,
);
router.get(
  "/findBookingVehicleByBookingId",
  authToken,
  bookingController.find_booking_vehicle_by_booking_id,
);
router.get("/updateStatus", authToken, bookingController.update_status);

module.exports = router;
