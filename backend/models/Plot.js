const mongoose = require('mongoose');

const plotSchema = new mongoose.Schema({
    plotName: {
        type: String,
        required: true,
        trim: true
    },
    plotSize: {
        type: Number,
        required: true,
        min: 0
    },
    cropType: {
        type: String,
        required: true
    },
    farm: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Farm',
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Plot', plotSchema);