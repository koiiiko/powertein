const express = require("express");
const {
  fetchFoodListSearch,
  saveUserConsume,
  userConsumeToday,
  deleteUserConsume,
} = require("./controller");

const router = express.Router();

router.get("/search", fetchFoodListSearch);
router.post("/save", saveUserConsume);
router.get("/today", userConsumeToday);
router.delete("/delete/:id", deleteUserConsume);

module.exports = router;
