// const initializeTrie = require('../config/trieConfig');

// // Khởi tạo Trie từ file CSV (hoặc Excel)
// const trie = initializeTrie('./uploads/chuyen_khoan.csv');

// // Hàm xử lý tìm kiếm
// const searchPrefix = (req, res) => {
//   const prefix = req.params.detail; // Lấy tiền tố từ URL
//   console.log('Prefix nhận được:', prefix);

//   // Kiểm tra dữ liệu trong Trie
//   const results = trie.getPrefix(prefix); // Tìm kiếm tiền tố
//   console.log('Kết quả tìm kiếm:', results);

//   // Xử lý nếu không có kết quả
//   if (!results || results.length === 0) {
//     return res.status(404).json({ message: 'No matching results found.' });
//   }

//   // Trả về kết quả
//   res.json({ prefix, results });
// };

// module.exports = { searchPrefix };
// controllers/trieController.js
// const Trie = require("../models/Trie");
// const fs = require("fs");
// const path = require("path");
// const csv = require("csv-parser");

// // Khởi tạo Trie
// const trie = new Trie();

// // Hàm tải và thêm từ khóa từ CSV vào Trie
// const loadCSV = () => {
//   const filePath = path.join(__dirname, "../uploads/chuyen_khoan.csv");

//   fs.createReadStream(filePath)
//     .pipe(csv())
//     .on("data", (row) => {
//       const details = row.detail.split(" "); // Tách cột "detail" thành từng từ
//       details.forEach((word) => {
//         trie.insert(word.toLowerCase()); // Thêm từ vào Trie
//       });
//     })
//     .on("end", () => {
//       console.log("CSV file successfully processed and Trie is populated!");
//     });
// };

// // Hàm tìm kiếm các từ có tiền tố trong Trie
// const searchTrie = (req, res) => {
//   const prefix = req.query.prefix || "";
//   const results = trie.search(prefix.toLowerCase());

//   res.json({ suggestions: results });
// };

// module.exports = { loadCSV, searchTrie };
// const Trie = require("../models/Trie");
// const fs = require("fs");
// const path = require("path");
// const csv = require("csv-parser");

// // Khởi tạo Trie
// const trie = new Trie();

// // Hàm tải và thêm từ khóa từ CSV vào Trie
// const loadCSV = () => {
//   const filePath = path.join(__dirname, "../uploads/chuyen_khoan.csv");

//   fs.createReadStream(filePath)
//     .pipe(csv())
//     .on("data", (row) => {
//       const details = row.detail.split(" "); // Tách cột "detail" thành từng từ
//       details.forEach((word) => {
//         trie.insert(word.toLowerCase()); // Thêm từ vào Trie
//       });
//     })
//     .on("end", () => {
//       console.log("CSV file successfully processed and Trie is populated!");
//     });
// };

// // Hàm tìm kiếm các từ có tiền tố trong Trie
// const searchTrie = (req, res) => {
//   const prefix = req.query.prefix || "";
//   const results = trie.search(prefix.toLowerCase());

//   res.json({ suggestions: results });
// };

// module.exports = { loadCSV, searchTrie };

// controllers/trieController.js
const Trie = require("../models/Trie");
const csv = require("csv-parser");
const fs = require("fs");
const path = require("path");

const trie = new Trie();

// Đọc CSV và thêm từ khóa vào Trie
const loadCSV = () => {
  const filePath = path.join(__dirname, "../uploads/chuyen_khoan.csv");
  const results = [];

  fs.createReadStream(filePath)
    .pipe(csv())
    .on("data", (data) => {
      results.push(data);
      const details = data.detail.split(" "); // Tách cột `detail` thành các từ khóa
      details.forEach((word) => {
        trie.insert(word, data); // Thêm từ vào Trie và lưu giao dịch
      });
    })
    .on("end", () => {
      console.log("CSV file has been processed");
    });
};

// Tìm kiếm từ khóa trong Trie
const searchTransactions = (req, res) => {
  const { keyword } = req.params;
  const transactions = trie.search(keyword);

  if (transactions.length === 0) {
    return res
      .status(404)
      .json({ message: "No transactions found for this keyword." });
  }

  res.json(transactions);
};

module.exports = { loadCSV, searchTransactions };
