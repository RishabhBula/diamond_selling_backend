// index.js
require('dotenv').config(); // Load environment variables from .env file

const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes/userLoginRoutes')
const cookieParser = require('cookie-parser');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(cookieParser()); // Use cookie-parser middleware

app.use('/', routes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
