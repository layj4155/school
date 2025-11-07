const mongoose = require('mongoose');

const ConductSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.ObjectId,
        ref: 'Student',
        required: true
    },
    term: {
        type: String,
        required: [true, 'Please add a term'],
        enum: ['Term 1', 'Term 2', 'Term 3']
    },
    academicYear: {
        type: String,
        required: [true, 'Please add academic year']
    },
    totalPoints: {
        type: Number,
        default: 40,
        min: 0,
        max: 40
    },
    remainingPoints: {
        type: Number,
        default: 40,
        min: 0,
        max: 40
    },
    deductionsCount: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ['Good', 'Warning', 'Critical'],
        default: 'Good'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

ConductSchema.pre('save', function(next) {
    if (this.remainingPoints >= 30) {
        this.status = 'Good';
    } else if (this.remainingPoints >= 20) {
        this.status = 'Warning';
    } else {
        this.status = 'Critical';
    }
    this.updatedAt = Date.now();
    next();
});

ConductSchema.index({ student: 1, term: 1, academicYear: 1 }, { unique: true });

module.exports = mongoose.model('Conduct', ConductSchema);
