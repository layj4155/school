const mongoose = require('mongoose');

const SubjectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a subject name'],
        trim: true
    },
    code: {
        type: String,
        trim: true,
        uppercase: true
    },
    class: {
        type: mongoose.Schema.ObjectId,
        ref: 'Class',
        required: [true, 'Please add a class']
    },
    teacher: {
        type: mongoose.Schema.ObjectId,
        ref: 'Teacher',
        required: [true, 'Please add a teacher']
    },
    students: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Student'
    }],
    description: {
        type: String,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Index to ensure unique subject per class
SubjectSchema.index({ name: 1, class: 1 }, { unique: true });

module.exports = mongoose.model('Subject', SubjectSchema);
