const mongoose = require('mongoose');

const DisciplineSummarySchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    term: {
        type: String,
        required: true,
        enum: ['Term 1', 'Term 2', 'Term 3']
    },
    totalReductions: {
        type: Number,
        required: true,
        min: 0
    },
    conductScore: {
        type: Number,
        required: true,
        min: 0,
        max: 40
    },
    publishedBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    publishedTo: {
        type: [String],
        default: ['DOS', 'SM']
    },
    publishedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('DisciplineSummary', DisciplineSummarySchema);