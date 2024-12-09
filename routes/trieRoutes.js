const express = require('express');
const router = express.Router();
const { searchPrefix } = require('../controllers/trieController');

// Định nghĩa route cho tìm kiếm
router.get('/search/:detail', searchPrefix);

module.exports = router;
