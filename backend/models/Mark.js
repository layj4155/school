const mongoose = require('mongoose');

const MarkSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.ObjectId,
        ref: 'User', // Assuming marks are linked to the User model
        required: true
    },
    subject: {
        type: String,
        required: [true, 'Please add a subject'],
        trim: true
    },
    marks: {
        type: Number,
        required: [true, 'Please add marks']
    },
    term: {
        type: String,
        required: [true, 'Please add a term'],
        enum: ['Term 1', 'Term 2', 'Term 3']
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Mark', MarkSchema);