const Trie = require('trie-prefix-tree');
const xlsx = require('xlsx');

// Tạo Trie để lưu trữ các từ
const detailTrie = new Trie();

// Hàm để khởi tạo Trie từ file Excel
function initializeTrieFromFile(filePath) {
  const workbook = xlsx.readFile(filePath);
  const sheetName = workbook.SheetNames[0];  // Đọc sheet đầu tiên
  const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

  // Kiểm tra dữ liệu trước khi thêm vào Trie
  sheetData.forEach(row => {
    if (row.detail && typeof row.detail === 'string') {
      const detail = String(row.detail);  // Chuyển phần detail thành chuỗi
      console.log('Adding detail to Trie:', detail);  // In chi tiết đang thêm vào Trie
      detailTrie.addWord(detail);  // Thêm phần detail vào Trie
    } else {
      console.log('Warning: Missing or invalid detail in row', row);
    }
  });

  console.log('Trie đã được khởi tạo từ file dữ liệu');
}

module.exports = {
  detailTrie,
  initializeTrieFromFile,
};
