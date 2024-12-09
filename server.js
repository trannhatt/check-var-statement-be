const express = require("express");
const multer = require("multer");
const path = require("path");
const { loadCSV } = require("./controllers/trieController");
const trieRoutes = require("./routes/trieRoutes");

const app = express();
const port = 3000;

const upload = multer({ dest: "uploads/" });

app.use(express.json());

loadCSV();

app.use("/api/trie", trieRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
