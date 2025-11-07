const mongoose = require('mongoose');

const ClassSchema = new mongoose.Schema({
    classID: {
        type: String,
        required: [true, 'Please add a class ID'],
        unique: true,
        trim: true
    },
    name: {
        type: String,
        required: [true, 'Please add a class name'],
        trim: true
    },
    level: {
        type: String,
        required: [true, 'Please add a level'],
        enum: ['O-Level', 'A-Level']
    },
    trade: {
        type: String,
        enum: ['None', 'SOD', 'ACC']
    },
    grade: {
        type: String,
        required: [true, 'Please add a grade'],
        enum: ['S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'L3', 'L4', 'L5']
    },
    section: {
        type: String,
        default: null
    },
    classTeacher: {
        type: mongoose.Schema.ObjectId,
        ref: 'Teacher'
    },
    students: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Student'
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Class', ClassSchema);
