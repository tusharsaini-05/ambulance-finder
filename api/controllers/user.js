const User = require("../models/user");
const jwt = require("jsonwebtoken");

exports.create_user = (req, res) => {
  const user = new User({ ...req.body });
  user
    .save()
    .then(() => {
      //after valid registration
      const token = jwt.sign({ id: user._id }, process.env.TOKEN_SECRET);
      res
        .status(201)
        .header("authorization", token)
        .json({ message: "Registration successful", user });
    })
    .catch((err) => {
      res.status(500).json({ message: "Registration failed" });
    });
};
exports.is_user_exist = (req, res) => {
  User.findOne({ phone: req.query.phone })
    .then((user) => {
      if (user) {
        res
          .status(200)
          .json({ message: "User exists", exist: true, type: user.type });
      } else {
        res.status(200).json({
          message: "User does not exist",
          exist: false,
        });
      }
    })
    .catch((err) => {
      res.status(500).json({ message: "Server error" });
    });
};
exports.find_user_by_phone = (req, res) => {
  User.findOne({ phone: req.query.phone })
    .then((user) => {
      if (user) {
        res.status(200).json({ message: "User exists", user });
      } else {
        res.status(400).json({ message: "User does not exist" });
      }
    })
    .catch((err) => {
      res.status(500).json({ message: "Server error" });
    });
};
exports.check_credentials = (req, res) => {
  User.findOne({ phone: req.body.phone })
    .then((user) => {
      if (user) {
        //check credentials
        if (user.password == req.body.password) {
          //after valid login
          const token = jwt.sign({ id: user._id }, process.env.TOKEN_SECRET);
          res
            .header("authorization", token)
            .status(200)
            .json({ message: "Log in successful", valid: true, user });
        } else {
          res
            .status(401)
            .json({ message: "Invalid credentials", valid: false });
        }
      } else {
        res.status(400).json({ message: "User does not exist" });
      }
    })
    .catch((err) => {
      res.status(500).json({ message: "Server error" });
    });
};
exports.login_with_phone = (req, res) => {
  User.findOne({ phone: req.body.phone })
    .then((user) => {
      if (user) {
        const token = jwt.sign({ id: user._id }, process.env.TOKEN_SECRET);
        res
          .header("authorization", token)
          .status(200)
          .json({ message: "Log in successful", valid: true, user });
      } else {
        res.status(400).json({ message: "User does not exist" });
      }
    })
    .catch((err) => {
      res.status(500).json({ message: "Server error" });
    });
};
exports.find_user_by_id = (req, res) => {
  const userId = req.query.id;
  User.findOne({ _id: userId })
    .select("-password")
    .then((user) => {
      if (user) {
        res.status(200).send(user);
      } else {
        res.status(400).json({ message: "Invalid request" });
      }
    })
    .catch((err) => {
      res.status(500).json({ message: "Server error" });
    });
};
exports.find_user_by_token = (req, res) => {
  User.findOne({ _id: req.userId })
    .then((user) => {
      if (user) {
        res.status(200).send(user);
      } else {
        res.status(400).json({ message: "Invalid request" });
      }
    })
    .catch((err) => {
      res.status(500).json({ message: "Server error" });
    });
};
exports.get_user_last_booking = (req, res) => {
  User.findOne({ _id: req.userId })
    .select("-password")
    .populate("last_booking")
    .then((user) => {
      if (user) {
        res.status(200).send(user);
      } else {
        res.status(400).json({ message: "Invalid request" });
      }
    })
    .catch((err) => {
      res.status(500).json({ message: "Server error" });
    });
};
exports.set_availability = (req, res) => {
  const id = req.query.id;
  const available = req.query.available;

  User.updateOne({ _id: id }, { available: available })
    .then((available) => {
      res.status(200).json({ message: "Updated successfully", available });
    })
    .catch(() => {
      res.status(500).json({ message: "Server error" });
    });
};
exports.set_account_status = (req, res) => {
  const id = req.query.id;
  const approved = req.query.approved;

  User.findOneAndUpdate({ _id: id }, { approved: approved }, { new: true })
    .then((user) => {
      res.status(200).json({ message: "Updated successfully", user });
    })
    .catch(() => {
      res.status(500).json({ message: "Server error" });
    });
};
exports.update_location = (req, res) => {
  User.updateOne(
    { _id: req.userId },
    { city: req.body.city, country: req.body.country },
  )
    .then((available) => {
      res.status(200).json({ message: "Updated successfully", available });
    })
    .catch(() => {
      res.status(500).json({ message: "Server error" });
    });
};
exports.update_profile = (req, res) => {
  req.file ? (req.body.profile_photo = req.file.filename) : null;

  User.updateOne({ _id: req.userId }, { $set: req.body })
    .then((user) => {
      res.status(200).json({ message: "Updated successfully", user });
    })
    .catch(() => {
      res.status(500).json({ message: "Server error" });
    });
};
exports.update_fields = (req, res) => {
  const data = JSON.parse(req.query.data);

  User.updateOne({ _id: req.userId }, { $set: data })
    .then(() => {
      res.status(200).json({ message: "Updated successfully" });
    })
    .catch(() => {
      res.status(500).json({ message: "Server error" });
    });
};
exports.upload_license = (req, res) => {
  User.updateOne({ _id: req.userId }, { license_photo: req.file.filename })
    .then((user) => {
      res.status(200).json({ message: "Updated successfully", user });
    })
    .catch(() => {
      res.status(500).json({ message: "Server error" });
    });
};
exports.find_vehicles_by_driver = (req, res) => {
  const fields = "_id vehicles first_name rating rating_count";
  User.find({
    city: req.body.pickup,
    available: true,
    approved: true,
  })
    .select(fields)
    .populate("vehicles")
    .then((vehicles) => {
      res.status(200).send({ vehicles });
    })
    .catch(() => {
      res.status(500).json({ message: "Server error" });
    });
};
exports.update_profile_rating = (req, res) => {
  let { receiver, oldRating, oldRatingCount, newRating } = JSON.parse(
    req.query.profileRating,
  );
  oldRating = oldRating === null ? 0 : parseFloat(oldRating);
  oldRatingCount = oldRatingCount === null ? 0 : parseFloat(oldRatingCount);
  const finalRating =
    (oldRating * oldRatingCount + newRating) / (oldRatingCount + 1);
  const roundedRating = Math.round(finalRating * 10) / 10;

  User.updateOne(
    { _id: receiver },
    { rating: roundedRating, rating_count: oldRatingCount + 1 },
  )
    .then(() => res.status(200).json({ message: "Updated successfully" }))
    .catch(() => res.status(500).json({ message: "Server error" }));
};
exports.get_driver = (req, res) => {
  User.find({ type: 1 })
    .select("_id first_name last_name driving_license approved license_photo")
    .sort("-createdAt")
    .then((drivers) => res.status(200).send(drivers))
    .catch((err) => res.status(500).json({ message: "Server error" }));
};
exports.get_driver_status = (req, res) => {
  const id = req.query.id;
  User.findOne({ _id: id })
    .select("approved")
    .then((drivers) => res.status(200).send(drivers.approved))
    .catch((err) => res.status(500).json({ message: "Server error" }));
};
