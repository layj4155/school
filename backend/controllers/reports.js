const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const User = require('../models/User');
const Mark = require('../models/Mark');

// @desc    Get final report for a student
// @route   GET /api/reports/final/:studentId
// @access  Private (DOS)
exports.getFinalReport = asyncHandler(async (req, res, next) => {
    const studentId = req.params.studentId;

    const student = await User.findById(studentId);

    if (!student || student.role !== 'Student') {
        return next(new ErrorResponse(`Student not found with id of ${studentId}`, 404));
    }

    const marks = await Mark.find({ student: studentId });

    // Placeholder for discipline reports
    const discipline = [];

    res.status(200).json({
        success: true,
        data: {
            student,
            marks,
            discipline
        }
    });
});