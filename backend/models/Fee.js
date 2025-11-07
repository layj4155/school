const mongoose = require('mongoose');

const FeeSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.ObjectId,
        ref: 'Student',
        required: true
    },
    studentId: {
        type: String,
        required: true
    },
    studentName: {
        type: String,
        required: true
    },
    class: {
        type: String,
        required: true
    },
    totalFees: {
        type: Number,
        required: [true, 'Please add total fees amount'],
        default: 0
    },
    amountPaid: {
        type: Number,
        default: 0
    },
    balance: {
        type: Number,
        default: 0
    },
    payments: [{
        amount: {
            type: Number,
            required: true
        },
        date: {
            type: Date,
            default: Date.now
        },
        method: {
            type: String,
            enum: ['Cash', 'Bank Transfer', 'Mobile Money', 'Cheque'],
            default: 'Cash'
        },
        receiptNumber: String,
        recordedBy: {
            type: mongoose.Schema.ObjectId,
            ref: 'User'
        }
    }],
    academicYear: {
        type: String,
        required: true
    },
    term: {
        type: String,
        enum: ['Term 1', 'Term 2', 'Term 3'],
        required: true
    },
    status: {
        type: String,
        enum: ['Paid', 'Partially Paid', 'Unpaid', 'Overdue'],
        default: 'Unpaid'
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

// Update balance before saving
FeeSchema.pre('save', function(next) {
    this.balance = this.totalFees - this.amountPaid;
    
    // Update status based on payment
    if (this.amountPaid === 0) {
        this.status = 'Unpaid';
    } else if (this.amountPaid >= this.totalFees) {
        this.status = 'Paid';
    } else {
        this.status = 'Partially Paid';
    }
    
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Fee', FeeSchema);
