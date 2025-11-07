const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Mark = require('../models/Mark');
const User = require('../models/User');

// @desc    Get all marks
// @route   GET /api/marks
// @access  Private (Admin, Teacher, DOS)
exports.getMarks = asyncHandler(async (req, res, next) => {
    res.status(200).json(res.advancedResults);
});

// @desc    Get single mark
// @route   GET /api/marks/:id
// @access  Private
exports.getMark = asyncHandler(async (req, res, next) => {
    const mark = await Mark.findById(req.params.id).populate('student', 'name');

    if (!mark) {
        return next(new ErrorResponse(`No mark found with the id of ${req.params.id}`, 404));
    }

    res.status(200).json({ success: true, data: mark });
});

// @desc    Add a mark
// @route   POST /api/marks
// @access  Private (Teacher, DOS)
exports.addMark = asyncHandler(async (req, res, next) => {
    req.body.recordedBy = req.user.id;

    const student = await User.findById(req.body.student);

    if (!student) {
        return next(new ErrorResponse(`No student with the id of ${req.body.student}`), 404);
    }

    const mark = await Mark.create(req.body);

    res.status(201).json({ success: true, data: mark });
});

// @desc    Update a mark
// @route   PUT /api/marks/:id
// @access  Private (Teacher, DOS)
exports.updateMark = asyncHandler(async (req, res, next) => {
    let mark = await Mark.findById(req.params.id);

    if (!mark) {
        return next(new ErrorResponse(`No mark found with the id of ${req.params.id}`, 404));
    }

    // Make sure user is the one who recorded the mark or is an admin
    if (mark.recordedBy.toString() !== req.user.id && req.user.role !== 'Admin') {
        return next(new ErrorResponse(`User ${req.user.id} is not authorized to update this mark`, 401));
    }

    mark = await Mark.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).json({ success: true, data: mark });
});

// @desc    Delete a mark
// @route   DELETE /api/marks/:id
// @access  Private (Teacher, DOS, Admin)
exports.deleteMark = asyncHandler(async (req, res, next) => {
    const mark = await Mark.findById(req.params.id);

    if (!mark) {
        return next(new ErrorResponse(`No mark found with the id of ${req.params.id}`, 404));
    }

    if (mark.recordedBy.toString() !== req.user.id && req.user.role !== 'Admin') {
        return next(new ErrorResponse(`User ${req.user.id} is not authorized to delete this mark`, 401));
    }

    await mark.remove();

    res.status(200).json({ success: true, data: {} });
});