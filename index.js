require('dotenv').config(); // Load environment variables from .env file

const cors = require('cors')
const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes/userLoginRoutes')
const cookieParser = require('cookie-parser');

const app = express();
app.use(cors())
app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:3001"],
  credentials: true
}));
const PORT = 3000;

app.use(bodyParser.json());
app.use(cookieParser()); // Use cookie-parser middleware

app.use('/', routes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
