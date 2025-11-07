const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/errorResponse");
const Mark = require("../models/Mark");
const Student = require("../models/Student");
const Class = require("../models/Class");

// @desc    Get performance data for a class
// @route   GET /api/performance
// @access  Private (DOS)
exports.getPerformanceData = asyncHandler(async (req, res, next) => {
    const { class: classId, term } = req.query;

    if (!classId || !term) {
        return next(new ErrorResponse('Please provide a class and a term', 400));
    }

    const marks = await Mark.find({ class: classId, term });

    const students = await Student.find({ class: classId });

    const performanceData = students.map(student => {
        const studentMarks = marks.filter(mark => mark.student.toString() === student._id.toString());
        const totalMarks = studentMarks.reduce((acc, mark) => acc + mark.marks, 0);
        const averageMarks = studentMarks.length > 0 ? totalMarks / studentMarks.length : 0;

        return {
            student,
            averageMarks
        };
    });

    performanceData.sort((a, b) => b.averageMarks - a.averageMarks);

    res.status(200).json({
        success: true,
        data: performanceData
    });
});

// @desc    Get overall performance data for all classes
// @route   GET /api/performance/overall
// @access  Private (DOS)
exports.getOverallPerformanceData = asyncHandler(async (req, res, next) => {
    const { term } = req.query;

    if (!term) {
        return next(new ErrorResponse('Please provide a term', 400));
    }

    const classes = await Class.find();

    const overallData = [];

    for (const c of classes) {
        const marks = await Mark.find({ class: c._id, term });
        const studentCount = await Student.countDocuments({ class: c._id });

        const totalMarks = marks.reduce((acc, mark) => acc + mark.marks, 0);
        const averageMarks = marks.length > 0 ? totalMarks / marks.length : 0;

        overallData.push({
            class: c,
            averageMarks,
            studentCount
        });
    }

    res.status(200).json({
        success: true,
        data: overallData
    });
});