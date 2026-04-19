const express = require('express');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');
const symptomRoutes = require('./routes/symptomRoutes');
const reportRoutes = require('./routes/reportRoutes');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');

dotenv.config();
connectDB();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api', symptomRoutes);
app.use('/api/report', reportRoutes);
app.use('/api/auth', authRoutes);

// Serve static files from the root directory
const path = require('path');
app.use(express.static(path.join(__dirname, '../')));

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Medi-Mate Backend listening at ${port}`);
});
