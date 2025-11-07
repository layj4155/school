const Class = require('../models/Class');
const User = require('../models/User');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get all classes
// @route   GET /api/classes
// @access  Private
exports.getClasses = asyncHandler(async (req, res, next) => {
    res.status(200).json(res.advancedResults);
});

// @desc    Get single class
// @route   GET /api/classes/:id
// @access  Private
exports.getClass = asyncHandler(async (req, res, next) => {
    const classData = await Class.findById(req.params.id).populate('students');

    if (!classData) {
        return next(
            new ErrorResponse(`Class not found with id of ${req.params.id}`, 404)
        );
    }

    res.status(200).json({ success: true, data: classData });
});

// @desc    Create new class
// @route   POST /api/classes
// @access  Private
exports.createClass = asyncHandler(async (req, res, next) => {
    const classData = await Class.create(req.body);

    res.status(201).json({
        success: true,
        data: classData
    });
});

// @desc    Update class
// @route   PUT /api/classes/:id
// @access  Private
exports.updateClass = asyncHandler(async (req, res, next) => {
    let classData = await Class.findById(req.params.id);

    if (!classData) {
        return next(
            new ErrorResponse(`Class not found with id of ${req.params.id}`, 404)
        );
    }

    classData = await Class.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).json({ success: true, data: classData });
});

// @desc    Delete class
// @route   DELETE /api/classes/:id
// @access  Private
exports.deleteClass = asyncHandler(async (req, res, next) => {
    const classData = await Class.findById(req.params.id);

    if (!classData) {
        return next(
            new ErrorResponse(`Class not found with id of ${req.params.id}`, 404)
        );
    }

    await classData.remove();

    res.status(200).json({ success: true, data: {} });
});

// @desc    Add student to class
// @route   POST /api/classes/:id/students
// @access  Private
exports.addStudentToClass = asyncHandler(async (req, res, next) => {
    const classData = await Class.findById(req.params.id);

    if (!classData) {
        return next(
            new ErrorResponse(`Class not found with id of ${req.params.id}`, 404)
        );
    }

    const student = await User.findById(req.body.studentId);

    if (!student) {
        return next(
            new ErrorResponse(`Student not found with id of ${req.body.studentId}`, 404)
        );
    }

    // Add student to class
    await classData.students.push(student);
    await classData.save();

    res.status(200).json({ success: true, data: classData });
});