// /routes/trieRoute.js
const express = require('express');
const router = express.Router();
const trieController = require('../controllers/trieController');

// Tìm kiếm theo detail
router.get('/api/search/:detail', trieController.searchByDetail);

module.exports = router;
