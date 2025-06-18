const router = require("express").Router();
const reviewController = require("../controllers/review");
const authToken = require("../middlewares/auth-token");

router.post(
  "/getReviewsByUserId",
  authToken,
  reviewController.get_review_by_user_id,
);
router.post("/createReview", authToken, reviewController.create_review);
router.get("/getReviewsByReceiver", reviewController.get_reviews_by_receiver);

module.exports = router;
