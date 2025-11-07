const mongoose = require('mongoose');

const MarkSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.ObjectId,
        ref: 'Student',
        required: true
    },
    class: {
        type: mongoose.Schema.ObjectId,
        ref: 'Class',
        required: true
    },
    subject: {
        type: String,
        required: [true, 'Please add a subject'],
        trim: true
    },
    assessmentType: {
        type: String,
        required: [true, 'Please add assessment type'],
        enum: ['Midterm Exam', 'Formative Assessment', 'End of Unity', 'Summative Exam', 'Integrated Assessment', 'Final Exam']
    },
    marks: {
        type: Number,
        required: [true, 'Please add marks'],
        min: 0,
        max: 100
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
    published: {
        type: Boolean,
        default: false
    },
    publishedAt: {
        type: Date
    },
    createdBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Mark', MarkSchema);
