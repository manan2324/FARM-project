const mongoose = require('mongoose');

const farmSchema = new mongoose.Schema({
    farmName: {
        type: String,
        required: true,
        trim: true
    },
    farmSize: {
        type: Number,
        required: true,
        min: 0
    },
    soilType: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    district: {
        type: String,
        required: true
    },
    village: {
        type: String,
        required: true
    },
    pinCode: {
        type: String,
        required: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    plots: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Plot'
    }],
    totalPlots: {
        type: Number,
        default: 0
    },
    totalPlotSize: {
        type: Number,
        default: 0
    },
    weather: {
        temperature: Number,
        condition: String,
        humidity: Number,
        windSpeed: Number,
        sunrise: Number,
        updatedAt: { type: Date, default: Date.now }
    }
}, {
    timestamps: true
});

// Middleware to update totalPlots and totalPlotSize when plots are modified
farmSchema.pre('save', async function(next) {
    if (this.plots) {
        this.totalPlots = this.plots.length;
        
        // Calculate total plot size by fetching all plots
        const Plot = mongoose.model('Plot');
        const plots = await Plot.find({ _id: { $in: this.plots } });
        this.totalPlotSize = plots.reduce((sum, plot) => sum + plot.plotSize, 0);
    }
    next();
});

module.exports = mongoose.model('Farm', farmSchema);