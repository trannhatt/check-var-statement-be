const express = require('express');
const app = express();
const port = 3000;
const { initializeTrieFromFile } = require('./config/trieConfig');

// Khởi tạo Trie từ file dữ liệu khi server bắt đầu
initializeTrieFromFile('./uploads/your_file.xlsx');  // Đảm bảo đường dẫn đúng

const trieRoute = require('./routes/trieRoute');
app.use(trieRoute);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
