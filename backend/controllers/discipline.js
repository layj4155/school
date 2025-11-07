const asyncHandler = require('../middleware/async');
const Discipline = require('../models/Discipline');
const DisciplineSummary = require('../models/DisciplineSummary');
const ErrorResponse = require('../utils/errorResponse');
const Student = require('../models/Student');

// @desc    Get all discipline reports
// @route   GET /api/discipline
// @access  Private (DOS, DOD)
exports.getDisciplineReports = asyncHandler(async (req, res, next) => {
    res.status(200).json(res.advancedResults);
});

// @desc    Create a discipline report
// @route   POST /api/discipline
// @access  Private (DOD)
exports.createDisciplineReport = asyncHandler(async (req, res, next) => {
    req.body.reportedBy = req.user.id;
    // Validate required fields
    const { student, reason, term, pointsReduction } = req.body;
    if (!student || !reason || !term || pointsReduction === undefined) {
        return next(new ErrorResponse('student, reason, term and pointsReduction are required', 400));
    }
    if (!['Term 1', 'Term 2', 'Term 3'].includes(term)) {
        return next(new ErrorResponse('Invalid term value', 400));
    }
    const report = await Discipline.create(req.body);

    res.status(201).json({
        success: true,
        data: report
    });
});

// @desc    Get conduct scores (40 - total reductions) for a class or entire school
// @route   GET /api/discipline/conduct
// @access  Private (DOS, DOD, SM)
exports.getConductScores = asyncHandler(async (req, res, next) => {
    const { class: classId, term } = req.query;
    if (!term) {
        return next(new ErrorResponse('term is required', 400));
    }

    // Fetch students based on class filter
    const studentQuery = classId ? { class: classId } : {};
    const students = await Student.find(studentQuery).select('name class');

    // Fetch discipline reports for term (optionally filter by student list to reduce workload)
    const reports = await Discipline.find({ term });

    const conductList = students.map((s) => {
        const reductions = reports
            .filter((r) => r.student.toString() === s._id.toString())
            .reduce((acc, r) => acc + (r.pointsReduction || 0), 0);
        const conductScore = Math.max(0, 40 - reductions);
        return { student: s, conductScore };
    });

    res.status(200).json({ success: true, data: conductList });
});

// @desc    Get low conduct list (< 20) per class or whole school
// @route   GET /api/discipline/low
// @access  Private (DOS, DOD, SM)
exports.getLowConduct = asyncHandler(async (req, res, next) => {
    const { class: classId, term } = req.query;
    if (!term) {
        return next(new ErrorResponse('term is required', 400));
    }

    // Reuse conduct computation
    req.query.class = classId;
    req.query.term = term;
    const studentQuery = classId ? { class: classId } : {};
    const students = await Student.find(studentQuery).select('name class');
    const reports = await Discipline.find({ term });
    const conductList = students.map((s) => {
        const reductions = reports
            .filter((r) => r.student.toString() === s._id.toString())
            .reduce((acc, r) => acc + (r.pointsReduction || 0), 0);
        const conductScore = Math.max(0, 40 - reductions);
        return { student: s, conductScore };
    });

    const lowList = conductList.filter((i) => i.conductScore < 20);
    res.status(200).json({ success: true, data: lowList });
});

// @desc    Publish final discipline report to DOS and SM
// @route   POST /api/discipline/publish/:studentId
// @access  Private (DOD)
exports.publishDisciplineReport = asyncHandler(async (req, res, next) => {
    const { term } = req.query;
    const { studentId } = req.params;
    if (!term) {
        return next(new ErrorResponse('term is required', 400));
    }

    // Fetch all reductions for student in the term
    const reports = await Discipline.find({ student: studentId, term });
    const totalReductions = reports.reduce((acc, r) => acc + (r.pointsReduction || 0), 0);
    const conductScore = Math.max(0, 40 - totalReductions);

    const summary = await DisciplineSummary.create({
        student: studentId,
        term,
        totalReductions,
        conductScore,
        publishedBy: req.user.id,
        publishedTo: ['DOS', 'SM']
    });

    res.status(201).json({ success: true, data: summary });
});

// @desc    Get discipline summary for a student-term
// @route   GET /api/discipline/summary/:studentId
// @access  Private (DOS, DOD, SM)
exports.getDisciplineSummary = asyncHandler(async (req, res, next) => {
    const { term } = req.query;
    const { studentId } = req.params;
    if (!term) {
        return next(new ErrorResponse('term is required', 400));
    }

    const summary = await DisciplineSummary.findOne({ student: studentId, term })
        .populate('student', 'name')
        .populate('publishedBy', 'name');
    if (!summary) {
        return next(new ErrorResponse('No published summary found for this student and term', 404));
    }
    res.status(200).json({ success: true, data: summary });
});