const Review = require("../models/review");

exports.get_review_by_user_id = (req, res) => {
  Review.find({ _id: req.userId })
    .then((reviews) => res.status(200).send(reviews))
    .catch((err) => {
      res.status(500).json({ message: "Server error" });
    });
};
exports.create_review = (req, res) => {
  const review = new Review({ ...req.body, ...{ user_id: req.userId } });
  review
    .save()
    .then(() => {
      res.status(200).json({ message: "Review successful" });
    })
    .catch(() => {
      res.status(500).json({ message: "Server error" });
    });
};
exports.get_reviews_by_receiver = (req, res) => {
  const receiverId = req.query.receiverId;
  Review.find({ receiver: receiverId })
    .populate("user_id", "first_name profile_photo")
    .then((reviews) => res.status(200).send(reviews))
    .catch(() => {
      res.status(500).json({ message: "Server error" });
    });
};
