const express = require('express');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const symptomRoutes = require('./routes/symptomRoutes');
const reportRoutes = require('./routes/reportRoutes');
const cycleRoutes = require('./routes/cycleRoutes');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');

dotenv.config();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.send('Medi-Mate API is running...');
});

app.use('/api', symptomRoutes);
app.use('/api/report', reportRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/cycles', cycleRoutes);

// Serve static files
app.use(express.static(path.join(__dirname, '../')));

const startServer = async () => {
  try {
    await connectDB();
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
      console.log(`Medi-Mate Backend listening at ${port}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err.message);
    process.exit(1);
  }
};

startServer();
