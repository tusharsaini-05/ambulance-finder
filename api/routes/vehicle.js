const router = require("express").Router();
const vehicleController = require("../controllers/vehicle");
const authToken = require("../middlewares/auth-token");
const upload = require("../middlewares/upload");

router.post(
  "/create",
  authToken,
  upload.vehicle.single("vehicle_photo"),
  vehicleController.create_vehicle,
);
router.post(
  "/getVehiclesByUserId",
  authToken,
  vehicleController.get_vehicles_by_user_id,
);
router.patch(
  "/updateVehicleWithImg",
  authToken,
  upload.vehicle.single("vehicle_photo"),
  vehicleController.update_vehicle,
);
router.patch(
  "/updateVehicle",
  authToken,
  upload.vehicle.none(),
  vehicleController.update_vehicle,
);
router.post("/getVehicleById", authToken, vehicleController.get_vehicle_by_id);

module.exports = router;
