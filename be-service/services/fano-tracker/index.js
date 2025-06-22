const express = require("express");
const {
  fetchFoodListSearch,
  saveUserConsume,
  displayUserConsumeToday,
  displayUserConsumeHistory,
  displayUserConsumeDetails,
  deleteUserConsume,
} = require("./controller");

const router = express.Router();

router.get("/search", fetchFoodListSearch);
router.post("/save", saveUserConsume);
router.get("/today/:userId", displayUserConsumeToday);
router.get("/history/:period", displayUserConsumeHistory);
router.get("/history/:timestamp/:userId", displayUserConsumeDetails);
router.delete("/delete/:id", deleteUserConsume);

module.exports = router;
