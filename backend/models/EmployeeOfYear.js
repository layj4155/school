const mongoose = require('mongoose');

const EmployeeOfYearSchema = new mongoose.Schema({
    employee: {
        type: mongoose.Schema.ObjectId,
        refPath: 'employeeModel',
        required: true
    },
    employeeModel: {
        type: String,
        required: true,
        enum: ['Teacher', 'User']
    },
    employeeName: {
        type: String,
        required: true
    },
    employeeType: {
        type: String,
        required: true,
        enum: ['Teacher', 'Staff']
    },
    achievement: {
        type: String,
        required: [true, 'Please add achievement description']
    },
    year: {
        type: String,
        required: [true, 'Please add year'],
        default: new Date().getFullYear().toString()
    },
    photo: {
        type: String
    },
    published: {
        type: Boolean,
        default: true
    },
    createdBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

EmployeeOfYearSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('EmployeeOfYear', EmployeeOfYearSchema);

