const initializeTrie = require('../config/trieConfig');

// Khởi tạo Trie từ file CSV (hoặc Excel)
const trie = initializeTrie('./uploads/chuyen_khoan.csv');

// Hàm xử lý tìm kiếm
const searchPrefix = (req, res) => {
  const prefix = req.params.detail; // Lấy tiền tố từ URL
  console.log('Prefix nhận được:', prefix);

  // Kiểm tra dữ liệu trong Trie
  const results = trie.getPrefix(prefix); // Tìm kiếm tiền tố
  console.log('Kết quả tìm kiếm:', results);

  // Xử lý nếu không có kết quả
  if (!results || results.length === 0) {
    return res.status(404).json({ message: 'No matching results found.' });
  }

  // Trả về kết quả
  res.json({ prefix, results });
};

module.exports = { searchPrefix };
