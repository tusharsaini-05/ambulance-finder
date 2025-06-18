const multer = require("multer");
const path = require("path");

const storageProfile = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./client/public/photos/profile");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const storageVehicle = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./client/public/photos/vehicle");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const storageLicense = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./client/public/photos/license");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

exports.profile = multer({ storage: storageProfile });
exports.vehicle = multer({ storage: storageVehicle });
exports.license = multer({ storage: storageLicense });
