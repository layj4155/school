const express = require('express');
const {
    getBooks,
    getBook,
    createBook,
    updateBook,
    deleteBook
} = require('../controllers/bookController');

const Book = require('../models/Book');
const advancedResults = require('../middleware/advancedResults');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// All routes below are protected and restricted to Librarian and School Manager
router.use(protect);
router.use(authorize('Librarian', 'SM'));

router
    .route('/')
    .get(advancedResults(Book), getBooks)
    .post(createBook);

router
    .route('/:id')
    .get(getBook)
    .put(updateBook)
    .delete(deleteBook);

module.exports = router;