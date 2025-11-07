const express = require('express');
const router = express.Router();
const Teacher = require('../models/Teacher');
const { protect, authorize } = require('../middleware/auth');

// @route   GET /api/trainers
// @desc    Get all trainers/teachers
// @access  Public
router.get('/', async (req, res) => {
    try {
        const teachers = await Teacher.find({ isActive: true }).sort({ name: 1 });
        
        res.status(200).json({
            success: true,
            count: teachers.length,
            data: teachers
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Server Error',
            error: error.message
        });
    }
});

// @route   GET /api/trainers/:id
// @desc    Get single trainer
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const teacher = await Teacher.findById(req.params.id).populate('assignedClasses');
        
        if (!teacher) {
            return res.status(404).json({
                success: false,
                msg: 'Teacher not found'
            });
        }
        
        res.status(200).json({
            success: true,
            data: teacher
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Server Error',
            error: error.message
        });
    }
});

// @route   POST /api/trainers
// @desc    Create new trainer
// @access  Private (IT, SM, DOS)
router.post('/', protect, authorize('IT', 'SM', 'DOS'), async (req, res) => {
    try {
        const teacher = await Teacher.create(req.body);
        
        res.status(201).json({
            success: true,
            data: teacher
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            msg: 'Failed to create teacher',
            error: error.message
        });
    }
});

// @route   PUT /api/trainers/:id
// @desc    Update trainer
// @access  Private (IT, SM, DOS)
router.put('/:id', protect, authorize('IT', 'SM', 'DOS'), async (req, res) => {
    try {
        const teacher = await Teacher.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        
        if (!teacher) {
            return res.status(404).json({
                success: false,
                msg: 'Teacher not found'
            });
        }
        
        res.status(200).json({
            success: true,
            data: teacher
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            msg: 'Failed to update teacher',
            error: error.message
        });
    }
});

// @route   DELETE /api/trainers/:id
// @desc    Delete trainer (soft delete)
// @access  Private (IT, SM)
router.delete('/:id', protect, authorize('IT', 'SM'), async (req, res) => {
    try {
        const teacher = await Teacher.findByIdAndUpdate(
            req.params.id,
            { isActive: false },
            { new: true }
        );
        
        if (!teacher) {
            return res.status(404).json({
                success: false,
                msg: 'Teacher not found'
            });
        }
        
        res.status(200).json({
            success: true,
            msg: 'Teacher deactivated successfully',
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
