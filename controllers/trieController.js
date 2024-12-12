// controllers/trieController.js
const Trie = require("../models/Trie");
const csv = require("csv-parser");
const fs = require("fs");
const path = require("path");

const fastcsv = require("fast-csv");

const trie = new Trie();

const loadCSV = () => {
  return new Promise((resolve, reject) => {
    const filePath = path.join(__dirname, "../uploads/chuyen_khoan.csv");
    const batchSize = 5000;
    const results = [];
    let rowCount = 0;

    const stream = fs
      .createReadStream(filePath)
      .pipe(fastcsv.parse({ headers: true }))
      .on("data", (data) => {
        results.push(data);

        if (results.length >= batchSize) {
          stream.pause();
          processBatch(results);
          results.length = 0;
          stream.resume();
        }

        rowCount++;
        if (rowCount % 10000 === 0) {
          console.log(`Đã đọc ${rowCount} dòng...`);
        }
      })
      .on("end", () => {
        if (results.length > 0) {
          processBatch(results);
        }
        console.log(`Tổng cộng: ${rowCount} dòng.`);
        resolve();
      })
      .on("error", reject);
  });
};

function processBatch(batch) {
  batch.forEach((data) => {
    const details = data.detail.split(" ");
    details.forEach((word) => {
      trie.insert(word, data);
    });
  });
}

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

const getAllData = (req, res) => {
  const allData = trie.getAllData();

  if (allData.length > 0) {
    res.status(200).json({
      message: "All data retrieved successfully",
      data: allData,
    });
  } else {
    res.status(404).json({
      message: "No data found",
    });
  }
};

module.exports = { loadCSV, searchTransactions, getAllData };
