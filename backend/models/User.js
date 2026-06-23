const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    uid: {
        type: String,
        required: true,
        unique: true
    },
    fullname: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
        required: true,
        unique: true
    },
    gender: {
        type: String,
        required: true,
        enum: ['male', 'female', 'other']
    },
    birthDate: {
        day: {
            type: Number,
            required: true,
            min: 1,
            max: 31
        },
        month: {
            type: String,
            required: true,
            enum: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']
        },
        year: {
            type: Number,
            required: true,
            min: 1900
        }
    },
    totalFarmSize: {
        type: Number,
        required: true,
        min: 0
    },
    farms: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Farm'
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('User', userSchema);