const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a title'],
        trim: true
    },
    author: {
        type: String,
        required: [true, 'Please add an author']
    },
    isbn: {
        type: String,
        unique: true,
        sparse: true
    },
    category: {
        type: String,
        default: 'General'
    },
    quantity: {
        type: Number,
        required: [true, 'Please add quantity'],
        default: 1,
        min: 0
    },
    availableQuantity: {
        type: Number,
        required: true,
        default: 1,
        min: 0
    },
    status: {
        type: String,
        enum: ['Available', 'Borrowed', 'Out of Stock'],
        default: 'Available'
    },
    borrowedBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'Student',
        required: false
    },
    borrowDate: {
        type: Date
    },
    dueDate: {
        type: Date
    },
    returnDate: {
        type: Date
    },
    borrowCount: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// Set defaults for existing books
BookSchema.pre('save', function(next) {
    // Set defaults if fields are missing
    if (this.quantity === undefined || this.quantity === null) {
        this.quantity = 1;
    }
    if (this.availableQuantity === undefined || this.availableQuantity === null) {
        this.availableQuantity = this.quantity;
    }
    if (this.borrowCount === undefined || this.borrowCount === null) {
        this.borrowCount = 0;
    }
    if (!this.category) {
        this.category = 'General';
    }

    // Update status based on available quantity
    if (this.availableQuantity === 0) {
        this.status = 'Out of Stock';
    } else if (this.availableQuantity < this.quantity) {
        this.status = 'Borrowed';
    } else {
        this.status = 'Available';
    }
    next();
});

module.exports = mongoose.model('Book', BookSchema);