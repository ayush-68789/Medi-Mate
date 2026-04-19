const express = require('express');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');
const symptomRoutes = require('./routes/symptomRoutes');
const reportRoutes = require('./routes/reportRoutes');

dotenv.config();


app.use(cors());
app.use(express.json());

// Symptom analyzer route
app.use('/api', symptomRoutes);
app.use('/api/report', reportRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Medi-Mate Backend listening at ${port}`);
});
