const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name'],
        trim: true
    },
    studentId: {
        type: String,
        required: [true, 'Please add a student ID'],
        unique: true
    },
    class: {
        type: String,
        required: [true, 'Please add a class']
    },
    parentName: {
        type: String
    },
    parentPhone: {
        type: String
    },
    // Link to the User model for the student's own account
    userAccount: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    // Link to the User model for the parent's account
    parentUserAccount: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Student', StudentSchema);