const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
    studentID: {
        type: String,
        required: [true, 'Please add a student ID'],
        unique: true
    },
    firstName: {
        type: String,
        required: [true, 'Please add first name'],
        trim: true
    },
    lastName: {
        type: String,
        required: [true, 'Please add last name'],
        trim: true
    },
    gender: {
        type: String,
        required: [true, 'Please add gender'],
        enum: ['Male', 'Female']
    },
    dateOfBirth: {
        type: Date,
        required: [true, 'Please add date of birth']
    },
    age: {
        type: Number
    },
    class: {
        type: mongoose.Schema.ObjectId,
        ref: 'Class',
        required: [true, 'Please add a class']
    },
    parentName: {
        type: String,
        required: [true, 'Please add parent/guardian name']
    },
    parentPhone: {
        type: String,
        required: [true, 'Please add parent/guardian phone number']
    },
    relationship: {
        type: String,
        required: [true, 'Please add relationship'],
        enum: ['Father', 'Mother', 'Guardian']
    },
    parentEmail: {
        type: String
    },
    address: {
        province: {
            type: String,
            required: [true, 'Please add province']
        },
        district: {
            type: String,
            required: [true, 'Please add district']
        },
        sector: {
            type: String,
            required: [true, 'Please add sector']
        },
        cell: {
            type: String,
            required: [true, 'Please add cell']
        },
        village: {
            type: String,
            required: [true, 'Please add village']
        }
    },
    userAccount: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    parentUserAccount: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

StudentSchema.pre('save', function(next) {
    if (this.dateOfBirth) {
        const today = new Date();
        const birthDate = new Date(this.dateOfBirth);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        this.age = age;
    }
    next();
});

module.exports = mongoose.model('Student', StudentSchema);
