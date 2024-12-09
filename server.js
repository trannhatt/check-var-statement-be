const express = require('express');
const app = express();
const port = 3000;

// Import route
const searchRoute = require('./routes/trieRoutes');

// Sử dụng route
app.use('/api', searchRoute);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
