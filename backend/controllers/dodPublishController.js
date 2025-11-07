const Conduct = require('../models/Conduct');
const ConductDeduction = require('../models/ConductDeduction');
const DisciplineSummary = require('../models/DisciplineSummary');
const Student = require('../models/Student');

exports.publishDisciplineReport = async (req, res) => {
    try {
        const { term, academicYear, studentIds } = req.body;

        let query = { term, academicYear };
        
        if (studentIds && studentIds.length > 0) {
            query.student = { $in: studentIds };
        }

        const conducts = await Conduct.find(query)
            .populate({
                path: 'student',
                select: 'firstName lastName studentID parentUserAccount userAccount'
            });

        const publishedReports = [];

        for (const conduct of conducts) {
            const deductions = await ConductDeduction.find({
                conduct: conduct._id
            }).populate('fault', 'name pointsToDeduct');

            const summary = await DisciplineSummary.create({
                student: conduct.student.userAccount || conduct.student._id,
                term: conduct.term,
                totalReductions: conduct.deductionsCount,
                conductScore: conduct.remainingPoints,
                publishedBy: req.user ? req.user.id : null,
                publishedTo: ['Student', 'Parent', 'DOS', 'SM']
            });

            publishedReports.push({
                student: conduct.student,
                summary,
                deductions
            });
        }

        res.status(201).json({
            success: true,
            message: `Published discipline reports for ${publishedReports.length} students`,
            count: publishedReports.length,
            data: publishedReports
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

exports.getPublishedReports = async (req, res) => {
    try {
        const { term, studentId } = req.query;

        const query = {};
        if (term) query.term = term;
        if (studentId) query.student = studentId;

        const reports = await DisciplineSummary.find(query)
            .populate('student', 'firstName lastName studentID')
            .populate('publishedBy', 'name email')
            .sort({ publishedAt: -1 });

        res.status(200).json({
            success: true,
            count: reports.length,
            data: reports
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

exports.getStudentDisciplineReport = async (req, res) => {
    try {
        const { studentId } = req.params;
        const { term, academicYear } = req.query;

        const query = { student: studentId };
        if (term) query.term = term;
        if (academicYear) query.academicYear = academicYear;

        const conduct = await Conduct.findOne(query)
            .populate('student', 'firstName lastName studentID class parentName parentPhone');

        if (!conduct) {
            return res.status(404).json({
                success: false,
                error: 'No conduct record found for this student'
            });
        }

        const deductions = await ConductDeduction.find({
            student: studentId,
            term: query.term,
            academicYear: query.academicYear
        })
            .populate('fault', 'name pointsToDeduct description')
            .populate('deductedBy', 'name')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: {
                conduct,
                deductions,
                summary: {
                    totalPoints: conduct.totalPoints,
                    remainingPoints: conduct.remainingPoints,
                    totalDeductions: conduct.deductionsCount,
                    pointsLost: conduct.totalPoints - conduct.remainingPoints,
                    status: conduct.status
                }
            }
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};
