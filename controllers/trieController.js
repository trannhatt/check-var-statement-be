// /controllers/trieController.js
const { detailTrie } = require('../config/trieConfig');

// Tìm kiếm theo detail (substring search)
function searchByDetail(req, res) {
  const detail = req.params.detail;
  console.log('Searching for detail:', detail);

  // Lấy tất cả các từ từ Trie
  const allWords = detailTrie.getWords();  // Lấy tất cả các từ trong Trie

  // Lọc các từ có chứa chuỗi tìm kiếm (substring)
  const result = allWords.filter(word => word.includes(detail));

  // Nếu không tìm thấy, trả về thông báo lỗi
  if (result.length === 0) {
    return res.status(404).json({ message: 'Detail not found' });
  }

  res.json({ detail: detail, result: result });
}

module.exports = {
  searchByDetail,
};
