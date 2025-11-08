const express = require('express');
const router = express.Router();
const News = require('../models/News');
const { protect, authorize } = require('../middleware/auth');

// @route   GET /api/news
// @desc    Get all news
// @access  Public
router.get('/', async (req, res) => {
    try {
        const { category, featured, all } = req.query;
        let query = {};
        
        // If 'all' parameter is not true, only show published news
        if (all !== 'true') {
            query.published = true;
        }
        
        if (category) query.category = category;
        if (featured) query.featured = featured === 'true';
        
        const news = await News.find(query)
            .sort({ createdAt: -1 })
            .populate('createdBy', 'name');
        
        res.status(200).json({
            success: true,
            count: news.length,
            data: news
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Server Error',
            error: error.message
        });
    }
});

// @route   GET /api/news/:id
// @desc    Get single news
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const news = await News.findById(req.params.id).populate('createdBy', 'name');
        
        if (!news) {
            return res.status(404).json({
                success: false,
                msg: 'News not found'
            });
        }
        
        res.status(200).json({
            success: true,
            data: news
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Server Error',
            error: error.message
        });
    }
});

// @route   POST /api/news
// @desc    Create new news
// @access  Private (All staff)
router.post('/', protect, authorize('IT', 'SM', 'DOS', 'DOD', 'Teacher', 'Patron', 'Matron'), async (req, res) => {
    try {
        req.body.createdBy = req.user.id;
        const news = await News.create(req.body);
        
        res.status(201).json({
            success: true,
            data: news
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            msg: 'Failed to create news',
            error: error.message
        });
    }
});

// @route   PUT /api/news/:id
// @desc    Update news
// @access  Private
router.put('/:id', protect, authorize('IT', 'SM', 'DOS', 'DOD', 'Teacher', 'Patron', 'Matron'), async (req, res) => {
    try {
        const news = await News.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        
        if (!news) {
            return res.status(404).json({
                success: false,
                msg: 'News not found'
            });
        }
        
        res.status(200).json({
            success: true,
            data: news
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            msg: 'Failed to update news',
            error: error.message
        });
    }
});

// @route   DELETE /api/news/:id
// @desc    Delete news
// @access  Private (IT, SM)
router.delete('/:id', protect, authorize('IT', 'SM'), async (req, res) => {
    try {
        const news = await News.findByIdAndDelete(req.params.id);
        
        if (!news) {
            return res.status(404).json({
                success: false,
                msg: 'News not found'
            });
        }
        
        res.status(200).json({
            success: true,
            msg: 'News deleted successfully',
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
