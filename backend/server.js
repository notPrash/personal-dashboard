const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/auth', authRoutes);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log("Backend running on http://localhost:" + PORT);
});
