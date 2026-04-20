const express = require('express');
const router = express.Router();
const symptomController = require('../controllers/symptomController');

// All analyze routes are currently public, will be protected later in the tasks
router.post('/analyze', symptomController.analyzeSymptoms);

module.exports = router;
