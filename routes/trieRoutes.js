const express = require("express");
const router = express.Router();
const {
  searchTransactions,
  getAllData,
} = require("../controllers/trieController");

router.get("/search/:keyword", searchTransactions);

router.get("/all", getAllData);

module.exports = router;
