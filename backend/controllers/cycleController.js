const CycleLog = require('../models/cycleLog');

// GET all cycle logs for the logged-in user
const getCycles = async (req, res) => {
  try {
    // req.user.id comes from your authMiddleware
    const cycles = await CycleLog.find({ userId: req.user.id }).sort({ start: -1 });
    res.json(cycles);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// POST — save a new cycle log
const addCycle = async (req, res) => {
  try {
    const { start, end } = req.body;

    if (!start) {
      return res.status(400).json({ message: 'Start date is required' });
    }

    const newCycle = new CycleLog({
      userId: req.user.id,
      start,
      end: end || null
    });

    const saved = await newCycle.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// DELETE — remove a cycle log by its MongoDB _id
const deleteCycle = async (req, res) => {
  try {
    const cycle = await CycleLog.findById(req.params.id);

    if (!cycle) {
      return res.status(404).json({ message: 'Cycle not found' });
    }

    // Make sure the cycle belongs to this user
    if (cycle.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not allowed' });
    }

    await CycleLog.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getCycles, addCycle, deleteCycle };