const express = require('express');
const router = express.Router();
const { getCycles, addCycle, deleteCycle } = require('../controllers/cycleController');
const protect = require('../middleware/authMiddleware');  // your existing middleware

router.get('/',protect, getCycles);
router.post('/', protect,addCycle);
router.delete('/:id', protect, deleteCycle);

module.exports = router;