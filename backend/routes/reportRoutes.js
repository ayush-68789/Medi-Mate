const express = require('express');
const router = express.Router();
const multer = require('multer');
const reportController = require('../controllers/reportController');

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

// Route for report analysis
router.post('/analyze', upload.single('report'), reportController.analyzeReport);

module.exports = router;
