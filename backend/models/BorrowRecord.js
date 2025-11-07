const mongoose = require('mongoose');

const BorrowRecordSchema = new mongoose.Schema({
    book: {
        type: mongoose.Schema.ObjectId,
        ref: 'Book',
        required: true
    },
    student: {
        type: mongoose.Schema.ObjectId,
        ref: 'Student',
        required: true
    },
    borrowDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    dueDate: {
        type: Date,
        required: true
    },
    returnDate: {
        type: Date
    },
    status: {
        type: String,
        enum: ['Borrowed', 'Returned', 'Overdue'],
        default: 'Borrowed'
    },
    fine: {
        type: Number,
        default: 0
    },
    notes: {
        type: String
    },
    borrowedBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

// Check if book is overdue
BorrowRecordSchema.pre('save', function(next) {
    if (!this.returnDate && new Date() > this.dueDate) {
        this.status = 'Overdue';
    }
    next();
});

module.exports = mongoose.model('BorrowRecord', BorrowRecordSchema);
