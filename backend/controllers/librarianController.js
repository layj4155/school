const Book = require('../models/Book');
const BorrowRecord = require('../models/BorrowRecord');
const Student = require('../models/Student');

// Borrow a book
exports.borrowBook = async (req, res) => {
    try {
        const { bookId, studentId, dueDate } = req.body;

        const book = await Book.findById(bookId);
        if (!book) {
            return res.status(404).json({
                success: false,
                error: 'Book not found'
            });
        }

        if (book.availableQuantity === 0 || !book.availableQuantity) {
            return res.status(400).json({
                success: false,
                error: 'Book is not available'
            });
        }

        const student = await Student.findById(studentId);
        if (!student) {
            return res.status(404).json({
                success: false,
                error: 'Student not found'
            });
        }

        // Create borrow record
        const borrowRecord = await BorrowRecord.create({
            book: bookId,
            student: studentId,
            dueDate: dueDate || new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
            borrowedBy: req.user ? req.user.id : null
        });

        // Update book
        book.availableQuantity = (book.availableQuantity || book.quantity) - 1;
        book.borrowCount = (book.borrowCount || 0) + 1;
        await book.save();

        const populatedRecord = await BorrowRecord.findById(borrowRecord._id)
            .populate('book', 'title author')
            .populate('student', 'firstName lastName studentID');

        res.status(201).json({
            success: true,
            data: populatedRecord
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

// Return a book
exports.returnBook = async (req, res) => {
    try {
        const { recordId } = req.params;

        const borrowRecord = await BorrowRecord.findById(recordId).populate('book');
        if (!borrowRecord) {
            return res.status(404).json({
                success: false,
                error: 'Borrow record not found'
            });
        }

        if (borrowRecord.status === 'Returned') {
            return res.status(400).json({
                success: false,
                error: 'Book already returned'
            });
        }

        // Calculate fine if overdue
        const today = new Date();
        if (today > borrowRecord.dueDate) {
            const daysOverdue = Math.ceil((today - borrowRecord.dueDate) / (1000 * 60 * 60 * 24));
            borrowRecord.fine = daysOverdue * 100; // 100 RWF per day
        }

        borrowRecord.returnDate = today;
        borrowRecord.status = 'Returned';
        await borrowRecord.save();

        // Update book
        const book = await Book.findById(borrowRecord.book._id);
        book.availableQuantity += 1;
        await book.save();

        res.status(200).json({
            success: true,
            data: borrowRecord
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

// Get all borrow records
exports.getBorrowRecords = async (req, res) => {
    try {
        const { status, studentId } = req.query;
        const query = {};
        
        if (status) query.status = status;
        if (studentId) query.student = studentId;

        const records = await BorrowRecord.find(query)
            .populate('book', 'title author isbn')
            .populate('student', 'firstName lastName studentID')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: records.length,
            data: records
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

// Get overdue books
exports.getOverdueBooks = async (req, res) => {
    try {
        const today = new Date();
        
        const overdueRecords = await BorrowRecord.find({
            status: { $in: ['Borrowed', 'Overdue'] },
            dueDate: { $lt: today },
            returnDate: null
        })
            .populate('book', 'title author isbn')
            .populate('student', 'firstName lastName studentID parentName parentPhone')
            .sort({ dueDate: 1 });

        // Update status to Overdue
        for (const record of overdueRecords) {
            if (record.status !== 'Overdue') {
                record.status = 'Overdue';
                await record.save();
            }
        }

        res.status(200).json({
            success: true,
            count: overdueRecords.length,
            data: overdueRecords
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

// Get most borrowed books
exports.getMostBorrowedBooks = async (req, res) => {
    try {
        const books = await Book.find()
            .sort({ borrowCount: -1 })
            .limit(10)
            .select('title author isbn category borrowCount');

        res.status(200).json({
            success: true,
            data: books
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

// Get library statistics
exports.getLibraryStats = async (req, res) => {
    try {
        const totalBooks = await Book.countDocuments();
        const availableBooks = await Book.countDocuments({ status: 'Available' });
        const borrowedBooks = await BorrowRecord.countDocuments({ status: 'Borrowed' });
        const overdueBooks = await BorrowRecord.countDocuments({ status: 'Overdue' });

        const categoryStats = await Book.aggregate([
            {
                $group: {
                    _id: '$category',
                    count: { $sum: 1 }
                }
            }
        ]);

        res.status(200).json({
            success: true,
            data: {
                totalBooks,
                availableBooks,
                borrowedBooks,
                overdueBooks,
                categoryStats
            }
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};
