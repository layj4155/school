const express = require('express');
const router = express.Router();
const Fee = require('../models/Fee');
const Student = require('../models/Student');
const { protect, authorize } = require('../middleware/auth');

// @route   GET /api/fees
// @desc    Get all fees
// @access  Private (Bursar, SM, IT)
router.get('/', protect, authorize('Bursar', 'SM', 'IT'), async (req, res) => {
    try {
        const { status, class: classFilter, term } = req.query;
        let query = {};
        
        if (status) query.status = status;
        if (classFilter) query.class = classFilter;
        if (term) query.term = term;
        
        const fees = await Fee.find(query)
            .populate('student', 'name studentId class')
            .populate('payments.recordedBy', 'name')
            .sort({ createdAt: -1 });
        
        res.status(200).json({
            success: true,
            count: fees.length,
            data: fees
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Server Error',
            error: error.message
        });
    }
});

// @route   GET /api/fees/student/:studentId
// @desc    Get fee for specific student
// @access  Private (Bursar, SM, IT, Parent, Student)
router.get('/student/:studentId', protect, async (req, res) => {
    try {
        const fees = await Fee.find({ studentId: req.params.studentId })
            .populate('payments.recordedBy', 'name')
            .sort({ createdAt: -1 });
        
        res.status(200).json({
            success: true,
            count: fees.length,
            data: fees
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Server Error',
            error: error.message
        });
    }
});

// @route   POST /api/fees
// @desc    Create fee record
// @access  Private (Bursar, SM, IT)
router.post('/', protect, authorize('Bursar', 'SM', 'IT'), async (req, res) => {
    try {
        const fee = await Fee.create(req.body);
        
        res.status(201).json({
            success: true,
            data: fee
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            msg: 'Failed to create fee record',
            error: error.message
        });
    }
});

// @route   POST /api/fees/:id/payment
// @desc    Record payment for student
// @access  Private (Bursar, SM, IT)
router.post('/:id/payment', protect, authorize('Bursar', 'SM', 'IT'), async (req, res) => {
    try {
        const fee = await Fee.findById(req.params.id);
        
        if (!fee) {
            return res.status(404).json({
                success: false,
                msg: 'Fee record not found'
            });
        }
        
        // Add payment to payments array
        fee.payments.push({
            amount: req.body.amount,
            method: req.body.method,
            receiptNumber: req.body.receiptNumber,
            recordedBy: req.user.id
        });
        
        // Update total amount paid
        fee.amountPaid += req.body.amount;
        
        await fee.save();
        
        res.status(200).json({
            success: true,
            msg: 'Payment recorded successfully',
            data: fee
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            msg: 'Failed to record payment',
            error: error.message
        });
    }
});

// @route   GET /api/fees/reports/summary
// @desc    Get fees summary report
// @access  Private (Bursar, SM)
router.get('/reports/summary', protect, authorize('Bursar', 'SM', 'IT'), async (req, res) => {
    try {
        const totalFees = await Fee.aggregate([
            {
                $group: {
                    _id: null,
                    totalExpected: { $sum: '$totalFees' },
                    totalCollected: { $sum: '$amountPaid' },
                    totalBalance: { $sum: '$balance' }
                }
            }
        ]);
        
        const statusCounts = await Fee.aggregate([
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);
        
        res.status(200).json({
            success: true,
            data: {
                summary: totalFees[0] || { totalExpected: 0, totalCollected: 0, totalBalance: 0 },
                statusBreakdown: statusCounts
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Server Error',
            error: error.message
        });
    }
});

module.exports = router;
