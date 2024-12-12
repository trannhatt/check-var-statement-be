const express = require("express");
const multer = require("multer");
const path = require("path");
const { loadCSV } = require("./controllers/trieController");
const trieRoutes = require("./routes/trieRoutes");
const cors = require("cors");

const app = express();
const port = 3001;

const upload = multer({ dest: "uploads/" });

app.use(
  cors({
    origin: "http://localhost:3000", // Your Next.js frontend URL
    methods: ["GET"], // Specify allowed methods
    allowedHeaders: ["Content-Type"], // Specify allowed headers
  })
);

app.use(express.json());

loadCSV();

app.use("/api/trie", trieRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
