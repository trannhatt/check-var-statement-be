const Trie = require('trie-prefix-tree');
const xlsx = require('xlsx');

function initializeTrie(filePath) {
  const workbook = xlsx.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);


  // Lọc và chỉ lấy cột `detail` chứa chuỗi
  const details = sheetData
    .filter(row => row.detail && typeof row.detail === 'string')
    .map(row => row.detail);


  // Khởi tạo Trie
  const trie = Trie(details);
  console.log('Trie đã khởi tạo thành công!');
  return trie;
}

module.exports = initializeTrie;
