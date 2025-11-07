const mongoose = require('mongoose');

const FaultSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a fault name'],
        unique: true,
        trim: true
    },
    pointsToDeduct: {
        type: Number,
        required: [true, 'Please add points to deduct'],
        min: [1, 'Points must be at least 1'],
        max: [40, 'Points cannot exceed 40']
    },
    description: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Fault', FaultSchema);
