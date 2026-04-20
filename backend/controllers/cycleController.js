const CycleLog = require('../models/cyclelogs');

// GET — fetch all cycles for logged in user
const getCycles = async (req, res) => {
  try {
    const cycles = await CycleLog.find({ userId: req.user.id }).sort({ start: -1 });
    res.json(cycles);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// POST — save a new cycle
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
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// DELETE — remove a cycle by its _id
const deleteCycle = async (req, res) => {
  try {
    const cycle = await CycleLog.findById(req.params.id);

    if (!cycle) {
      return res.status(404).json({ message: 'Cycle not found' });
    }

    await CycleLog.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getCycles, addCycle, deleteCycle };