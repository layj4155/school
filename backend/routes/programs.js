const express = require('express');
const router = express.Router();
const Program = require('../models/Program');
const { protect, authorize } = require('../middleware/auth');

// @route   GET /api/programs
// @desc    Get all programs
// @access  Public
router.get('/', async (req, res) => {
    try {
        const programs = await Program.find({ isActive: true }).sort({ name: 1 });
        
        res.status(200).json({
            success: true,
            count: programs.length,
            data: programs
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Server Error',
            error: error.message
        });
    }
});

// @route   GET /api/programs/:id
// @desc    Get single program
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const program = await Program.findById(req.params.id);
        
        if (!program) {
            return res.status(404).json({
                success: false,
                msg: 'Program not found'
            });
        }
        
        res.status(200).json({
            success: true,
            data: program
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Server Error',
            error: error.message
        });
    }
});

// @route   POST /api/programs
// @desc    Create new program
// @access  Private (IT, SM, DOS)
router.post('/', protect, authorize('IT', 'SM', 'DOS'), async (req, res) => {
    try {
        const program = await Program.create(req.body);
        
        res.status(201).json({
            success: true,
            data: program
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            msg: 'Failed to create program',
            error: error.message
        });
    }
});

// @route   PUT /api/programs/:id
// @desc    Update program
// @access  Private (IT, SM, DOS)
router.put('/:id', protect, authorize('IT', 'SM', 'DOS'), async (req, res) => {
    try {
        const program = await Program.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        
        if (!program) {
            return res.status(404).json({
                success: false,
                msg: 'Program not found'
            });
        }
        
        res.status(200).json({
            success: true,
            data: program
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            msg: 'Failed to update program',
            error: error.message
        });
    }
});

// @route   DELETE /api/programs/:id
// @desc    Delete program (soft delete)
// @access  Private (IT, SM)
router.delete('/:id', protect, authorize('IT', 'SM'), async (req, res) => {
    try {
        const program = await Program.findByIdAndUpdate(
            req.params.id,
            { isActive: false },
            { new: true }
        );
        
        if (!program) {
            return res.status(404).json({
                success: false,
                msg: 'Program not found'
            });
        }
        
        res.status(200).json({
            success: true,
            msg: 'Program deactivated successfully',
            data: {}
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
