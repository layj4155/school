const Book = require('../models/Book');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get all books
// @route   GET /api/books
// @access  Private (Librarian, SM)
exports.getBooks = asyncHandler(async (req, res, next) => {
    res.status(200).json(res.advancedResults);
});

// @desc    Get single book
// @route   GET /api/books/:id
// @access  Private (Librarian, SM)
exports.getBook = asyncHandler(async (req, res, next) => {
    const book = await Book.findById(req.params.id);

    if (!book) {
        return next(new ErrorResponse(`Book not found with id of ${req.params.id}`, 404));
    }

    res.status(200).json({ success: true, data: book });
});

// @desc    Create new book
// @route   POST /api/books
// @access  Private (Librarian, SM)
exports.createBook = asyncHandler(async (req, res, next) => {
    const book = await Book.create(req.body);
    res.status(201).json({
        success: true,
        data: book
    });
});

// @desc    Update book
// @route   PUT /api/books/:id
// @access  Private (Librarian, SM)
exports.updateBook = asyncHandler(async (req, res, next) => {
    let book = await Book.findById(req.params.id);

    if (!book) {
        return next(new ErrorResponse(`Book not found with id of ${req.params.id}`, 404));
    }

    book = await Book.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).json({ success: true, data: book });
});

// @desc    Delete book
// @route   DELETE /api/books/:id
// @access  Private (Librarian, SM)
exports.deleteBook = asyncHandler(async (req, res, next) => {
    const book = await Book.findById(req.params.id);

    if (!book) {
        return next(new ErrorResponse(`Book not found with id of ${req.params.id}`, 404));
    }

    await book.remove();

    res.status(200).json({ success: true, data: {} });
});