const express = require('express');
const router = express.Router();
const Book = require('../models/Book');

const {
    getBook,
    createBook,
    updateBook,
    deleteBook
} = require('../controllers/bookController');

const {
    borrowBook,
    returnBook,
    getBorrowRecords,
    getOverdueBooks,
    getMostBorrowedBooks,
    getLibraryStats
} = require('../controllers/librarianController');

// Book Management
router.get('/books', async (req, res) => {
    try {
        const books = await Book.find().sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            count: books.length,
            data: books
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
});

router.post('/books', createBook);
router.get('/books/:id', getBook);
router.put('/books/:id', updateBook);
router.delete('/books/:id', deleteBook);

// Borrow/Return
router.post('/borrow', borrowBook);
router.put('/return/:recordId', returnBook);
router.get('/records', getBorrowRecords);

// Reports & Stats
router.get('/overdue', getOverdueBooks);
router.get('/most-borrowed', getMostBorrowedBooks);
router.get('/stats', getLibraryStats);

module.exports = router;
