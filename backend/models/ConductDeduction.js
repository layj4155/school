const mongoose = require('mongoose');

const ConductDeductionSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.ObjectId,
        ref: 'Student',
        required: true
    },
    conduct: {
        type: mongoose.Schema.ObjectId,
        ref: 'Conduct',
        required: true
    },
    fault: {
        type: mongoose.Schema.ObjectId,
        ref: 'Fault',
        required: true
    },
    pointsDeducted: {
        type: Number,
        required: true,
        min: 1
    },
    comment: {
        type: String,
        required: [true, 'Please add a comment']
    },
    deductionType: {
        type: String,
        enum: ['Individual', 'Class'],
        required: true
    },
    class: {
        type: mongoose.Schema.ObjectId,
        ref: 'Class'
    },
    term: {
        type: String,
        required: true
    },
    academicYear: {
        type: String,
        required: true
    },
    deductedBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('ConductDeduction', ConductDeductionSchema);
