const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const symptomRoutes = require('./routes/symptomRoutes');
const reportRoutes = require('./routes/reportRoutes');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Symptom analyzer route
app.use('/api', symptomRoutes);
app.use('/api/report', reportRoutes);

app.listen(port, () => {
  console.log(`Medi-Mate Backend listening at ${port}`);
});
