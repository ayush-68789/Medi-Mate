const express = require('express');
const router = express.Router();
const { getCycles, addCycle, deleteCycle } = require('../controllers/cycleController');
const authMiddleware = require('../middleware/authMiddleware'); // your existing middleware

// All routes are protected — user must be logged in
router.get('/',authMiddleware, getCycles);
router.post('/',authMiddleware, addCycle);
router.delete('/:id',authMiddleware, deleteCycle);

module.exports = router;