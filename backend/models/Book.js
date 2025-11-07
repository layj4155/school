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
        sparse: true // Allows multiple documents to have a null isbn
    },
    status: {
        type: String,
        enum: ['Available', 'Borrowed'],
        default: 'Available'
    },
    borrowedBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: false
    },
    borrowDate: {
        type: Date
    },
    returnDate: {
        type: Date
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Book', BookSchema);