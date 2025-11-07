const mongoose = require('mongoose');

const DisciplineSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    term: {
        type: String,
        required: [true, 'Please specify the term'],
        enum: ['Term 1', 'Term 2', 'Term 3']
    },
    reason: {
        type: String,
        required: [true, 'Please add a reason'],
        trim: true
    },
    pointsReduction: {
        type: Number,
        required: [true, 'Please add reduction points for this fault'],
        min: [0, 'Reduction must be >= 0'],
        max: [40, 'Reduction must be <= 40']
    },
    reportedBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Discipline', DisciplineSchema);