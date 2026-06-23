require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const verifyFirebaseToken = require('./middleware/auth');
const farmRoutes = require('./routes/farms');

// Import models    
const User = require('./models/User');
const Farm = require('./models/Farm');
const Plot = require('./models/Plot');

const app = express();

// Global error handler
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
};

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/farms', farmRoutes);

async function main() {
    mongoose.connect(process.env.MONGODB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
}

main()
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
    res.send("Welcome to home page");
});

// User profile route
app.get("/user", verifyFirebaseToken, async (req, res) => {
    try {
        let user = await User.findOne({ uid: req.user.uid });
        if (!user) {
            user = await User.findOne({ phoneNumber: req.user.phoneNumber });
        }
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        res.json(user);
    } catch (error) {
        console.error("Error fetching user profile:", error);
        res.status(500).json({ error: "Error fetching user profile" });
    }
});

// Create or update user profile
app.post("/user", verifyFirebaseToken, async (req, res) => {
    try {
        // First try to find user by UID
        let user = await User.findOne({ uid: req.user.uid });
        
        // If not found by UID, try to find by phone number
        if (!user) {
            user = await User.findOne({ phoneNumber: req.user.phoneNumber });
        }

        if (user) {
            // Update existing user
            Object.assign(user, { 
                uid: req.user.uid,  // ensure UID is updated
                ...req.body 
            });
            await user.save();
        } else {
            // Create new user
            user = new User({
                uid: req.user.uid,
                phoneNumber: req.user.phoneNumber,
                ...req.body
            });
            await user.save();
        }
        res.json(user);
    } catch (error) {
        console.error("Error updating user profile:", error);
        if (error.code === 11000) { // Duplicate key error
            res.status(400).json({ error: "A user with this phone number already exists" });
        } else {
            res.status(500).json({ error: error.message || "Error updating user profile" });
        }
    }
});

// Apply error handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});