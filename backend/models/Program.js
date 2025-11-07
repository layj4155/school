const mongoose = require('mongoose');

const ProgramSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a program name'],
        unique: true,
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Please add a description']
    },
    duration: {
        type: String,
        default: '3 years'
    },
    level: {
        type: String,
        enum: ['Level 3', 'Level 4', 'Level 5', 'Level 6'],
        default: 'Level 3'
    },
    department: {
        type: String,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Program', ProgramSchema);
