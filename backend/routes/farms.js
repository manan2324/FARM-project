const express = require('express');
const router = express.Router();
const Farm = require('../models/Farm');
const Plot = require('../models/Plot');
const User = require('../models/User');
const verifyFirebaseToken = require('../middleware/auth');

// Get all farms for the authenticated user
router.get('/', verifyFirebaseToken, async (req, res) => {
    try {
        let user = await User.findOne({ uid: req.user.uid });
        if (!user && req.user.phoneNumber) {
            user = await User.findOne({ phoneNumber: req.user.phoneNumber });
        }

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const farms = await Farm.find({ owner: user._id })
            .populate('plots')
            .sort({ createdAt: -1 });
        
        res.json(farms);
    } catch (error) {
        console.error('Error fetching farms:', error);
        res.status(500).json({ error: 'Error fetching farms' });
    }
});

// Get a specific farm
router.get('/:id', verifyFirebaseToken, async (req, res) => {
    try {
        let user = await User.findOne({ uid: req.user.uid }).populate('farms');
        if (!user && req.user.phoneNumber) {
            user = await User.findOne({ phoneNumber: req.user.phoneNumber });
        }
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const farm = await Farm.findOne({
            _id: req.params.id,
            owner: user._id
        }).populate('plots');

        if (!farm) {
            return res.status(404).json({ error: 'Farm not found' });
        }

        res.json(farm);
    } catch (error) {
        console.error('Error fetching farm:', error);
        res.status(500).json({ error: 'Error fetching farm' });
    }
});

// Create a new farm with plots
router.post('/', verifyFirebaseToken, async (req, res) => {
    try {
        // First try by UID
        let user = await User.findOne({ uid: req.user.uid });
        
        // If not found by UID, try by phone number
        if (!user && req.user.phoneNumber) {
            user = await User.findOne({ phoneNumber: req.user.phoneNumber });
        }
        
        if (!user) {
            return res.status(404).json({ error: 'User not found. Please complete your profile first.' });
        }

        const { plots, ...farmData } = req.body;
        
        // Create the farm first
        const farm = new Farm({
            ...farmData,
            owner: user._id
        });
        await farm.save();

        await User.findByIdAndUpdate(user._id, { $push: { farms: farm._id } });

        // Create plots if any
        if (plots && plots.length > 0) {
            const plotDocuments = plots.map(plot => ({
                ...plot,
                farm: farm._id
            }));

            const savedPlots = await Plot.insertMany(plotDocuments);
            farm.plots = savedPlots.map(plot => plot._id);
            await farm.save();
        }

        // Fetch the complete farm with plots
        const populatedFarm = await Farm.findById(farm._id).populate('plots');
        res.status(201).json(populatedFarm);
    } catch (error) {
        console.error('Error creating farm:', error);
        res.status(500).json({ error: 'Error creating farm' });
    }
});

// Update a farm
router.put('/:id', verifyFirebaseToken, async (req, res) => {
    try {
        let user = await User.findOne({ uid: req.user.uid });
        if (!user && req.user.phoneNumber) {
            user = await User.findOne({ phoneNumber: req.user.phoneNumber });
        }
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const farm = await Farm.findOne({
            _id: req.params.id,
            owner: user._id
        });

        if (!farm) {
            return res.status(404).json({ error: 'Farm not found' });
        }

        const { plots, ...farmData } = req.body;

        // Update farm data
        Object.assign(farm, farmData);
        await farm.save();

        // Handle plots update
        if (plots) {
            // Remove existing plots
            await Plot.deleteMany({ farm: farm._id });

            // Create new plots
            const plotDocuments = plots.map(plot => ({
                ...plot,
                farm: farm._id
            }));

            const savedPlots = await Plot.insertMany(plotDocuments);
            farm.plots = savedPlots.map(plot => plot._id);
            await farm.save();
        }

        // Fetch updated farm with plots
        const updatedFarm = await Farm.findById(farm._id).populate('plots');
        res.json(updatedFarm);
    } catch (error) {
        console.error('Error updating farm:', error);
        res.status(500).json({ error: 'Error updating farm' });
    }
});

// Update weather for a farm
router.put('/:id/weather', async (req, res) => {
  try {
    const { temperature, condition, humidity, windSpeed, sunrise } = req.body;

    const farm = await Farm.findByIdAndUpdate(
      req.params.id,
      {
        weather: {
          temperature,
          condition,
          humidity,
          windSpeed,
          sunrise,
          updatedAt: new Date()
        }
      },
      { new: true }
    );

    if (!farm) return res.status(404).json({ error: "Farm not found" });

    res.json(farm);
  } catch (err) {
    console.error("Weather update failed:", err);
    res.status(500).json({ error: "Failed to update weather" });
  }
});

// Delete a farm
router.delete('/:id', verifyFirebaseToken, async (req, res) => {
    try {
        let user = await User.findOne({ uid: req.user.uid });
        if (!user && req.user.phoneNumber) {
            user = await User.findOne({ phoneNumber: req.user.phoneNumber });
        }
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const farm = await Farm.findOne({
            _id: req.params.id,
            owner: user._id
        });

        if (!farm) {
            return res.status(404).json({ error: 'Farm not found' });
        }

        // Remove the farm reference from the user's farms array
        await User.findByIdAndUpdate(user._id, {
            $pull: { farms: farm._id }
        });

        // Delete all plots associated with the farm
        await Plot.deleteMany({ farm: farm._id });

        // Delete the farm
        await farm.deleteOne();

        res.json({ message: 'Farm deleted successfully' });
    } catch (error) {
        console.error('Error deleting farm:', error);
        res.status(500).json({ error: 'Error deleting farm' });
    }
});

module.exports = router;