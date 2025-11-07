const Conduct = require('../models/Conduct');
const ConductDeduction = require('../models/ConductDeduction');
const DisciplineSummary = require('../models/DisciplineSummary');
const Student = require('../models/Student');

exports.publishDisciplineReport = async (req, res) => {
    try {
        const { term, academicYear, studentIds } = req.body;

        if (!term || !academicYear) {
            return res.status(400).json({
                success: false,
                error: 'Please provide term and academic year'
            });
        }

        let query = { term, academicYear };
        
        if (studentIds && studentIds.length > 0) {
            query.student = { $in: studentIds };
        }

        const conducts = await Conduct.find(query)
            .populate({
                path: 'student',
                select: 'firstName lastName studentID parentUserAccount userAccount'
            });

        if (conducts.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'No conduct records found for the specified criteria'
            });
        }

        const publishedReports = [];

        for (const conduct of conducts) {
            // Check if already published
            const existingSummary = await DisciplineSummary.findOne({
                student: conduct.student._id,
                term: conduct.term,
                academicYear: conduct.academicYear
            });

            if (existingSummary) {
                // Update existing summary
                existingSummary.totalReductions = conduct.deductionsCount;
                existingSummary.conductScore = conduct.remainingPoints;
                existingSummary.publishedAt = Date.now();
                if (req.user) {
                    existingSummary.publishedBy = req.user.id;
                }
                await existingSummary.save();
                publishedReports.push(existingSummary);
            } else {
                // Create new summary
                const summaryData = {
                    student: conduct.student._id,
                    term: conduct.term,
                    academicYear: conduct.academicYear,
                    totalReductions: conduct.deductionsCount,
                    conductScore: conduct.remainingPoints,
                    publishedTo: ['Student', 'Parent', 'DOS', 'SM']
                };

                if (req.user && req.user.id) {
                    summaryData.publishedBy = req.user.id;
                }

                const summary = await DisciplineSummary.create(summaryData);
                publishedReports.push(summary);
            }
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
