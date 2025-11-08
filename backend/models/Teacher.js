const mongoose = require('mongoose');

const TeacherSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name'],
        trim: true
    },
    teacherId: {
        type: String,
        required: [true, 'Please add a teacher ID'],
        unique: true
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true
    },
    phone: {
        type: String,
        required: [true, 'Please add a phone number']
    },
    subject: {
        type: String,
        required: [true, 'Please add subject taught']
    },
    specialties: String,
    department: {
        type: String,
        enum: ['Software Development', 'Accounting', 'Business', 'Networking', 'Hospitality', 'O-Level', 'Support'],
        required: false
    },
    level: {
        type: String,
        enum: ['O-Level', 'A-Level'],
        required: false
    },
    trade: {
        type: String,
        enum: ['None', 'SOD', 'ACC'],
        default: 'None'
    },
    photo: String,
    userAccount: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    assignedClasses: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Class'
    }],
    isActive: {
        type: Boolean,
        default: true
    },
    joinedDate: {
        type: Date,
        default: Date.now
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Teacher', TeacherSchema);
