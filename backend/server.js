const express = require('express');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');
const symptomRoutes = require('./routes/symptomRoutes');

dotenv.config();


app.use(cors());
app.use(express.json());

// Routes


// Symptom analyzer route
app.use('/api', symptomRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Medi-Mate Backend listening at ${port}`);
});
