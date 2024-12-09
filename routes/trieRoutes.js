const express = require("express");
const router = express.Router();
const { searchTransactions } = require("../controllers/trieController");

router.get("/search/:keyword", searchTransactions);

module.exports = router;
