const Conduct = require('../models/Conduct');
const ConductDeduction = require('../models/ConductDeduction');
const Student = require('../models/Student');
const Class = require('../models/Class');
const Fault = require('../models/Fault');

const getOrCreateConduct = async (studentId, term, academicYear) => {
    let conduct = await Conduct.findOne({
        student: studentId,
        term,
        academicYear
    });

    if (!conduct) {
        conduct = await Conduct.create({
            student: studentId,
            term,
            academicYear,
            totalPoints: 40,
            remainingPoints: 40
        });
    }

    return conduct;
};

exports.deductFromStudents = async (req, res) => {
    try {
        const { studentIds, faultId, comment, term, academicYear } = req.body;

        const fault = await Fault.findById(faultId);
        if (!fault) {
            return res.status(404).json({
                success: false,
                error: 'Fault not found'
            });
        }

        const deductions = [];

        for (const studentId of studentIds) {
            const student = await Student.findById(studentId);
            if (!student) continue;

            const conduct = await getOrCreateConduct(studentId, term, academicYear);

            const newRemainingPoints = Math.max(0, conduct.remainingPoints - fault.pointsToDeduct);
            conduct.remainingPoints = newRemainingPoints;
            conduct.deductionsCount += 1;
            await conduct.save();

            const deduction = await ConductDeduction.create({
                student: studentId,
                conduct: conduct._id,
                fault: faultId,
                pointsDeducted: fault.pointsToDeduct,
                comment,
                deductionType: 'Individual',
                term,
                academicYear,
                deductedBy: req.user ? req.user.id : null
            });

            deductions.push(deduction);
        }

        res.status(201).json({
            success: true,
            count: deductions.length,
            data: deductions
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

exports.deductFromClass = async (req, res) => {
    try {
        const { classId, faultId, comment, term, academicYear } = req.body;

        const classData = await Class.findById(classId).populate('students');
        if (!classData) {
            return res.status(404).json({
                success: false,
                error: 'Class not found'
            });
        }

        const fault = await Fault.findById(faultId);
        if (!fault) {
            return res.status(404).json({
                success: false,
                error: 'Fault not found'
            });
        }

        const deductions = [];

        for (const studentId of classData.students) {
            const conduct = await getOrCreateConduct(studentId, term, academicYear);

            const newRemainingPoints = Math.max(0, conduct.remainingPoints - fault.pointsToDeduct);
            conduct.remainingPoints = newRemainingPoints;
            conduct.deductionsCount += 1;
            await conduct.save();

            const deduction = await ConductDeduction.create({
                student: studentId,
                conduct: conduct._id,
                fault: faultId,
                pointsDeducted: fault.pointsToDeduct,
                comment,
                deductionType: 'Class',
                class: classId,
                term,
                academicYear,
                deductedBy: req.user ? req.user.id : null
            });

            deductions.push(deduction);
        }

        res.status(201).json({
            success: true,
            count: deductions.length,
            message: `Deducted ${fault.pointsToDeduct} points from ${deductions.length} students in class ${classData.name}`,
            data: deductions
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

exports.getLowConductAlerts = async (req, res) => {
    try {
        const { term, academicYear } = req.query;

        const query = {
            remainingPoints: { $lt: 20 }
        };

        if (term) query.term = term;
        if (academicYear) query.academicYear = academicYear;

        const conducts = await Conduct.find(query)
            .populate({
                path: 'student',
                select: 'firstName lastName studentID parentName parentPhone parentEmail relationship class',
                populate: {
                    path: 'class',
                    select: 'classID name'
                }
            })
            .sort({ remainingPoints: 1 });

        res.status(200).json({
            success: true,
            count: conducts.length,
            data: conducts
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

exports.getStudentConduct = async (req, res) => {
    try {
        const { studentId } = req.params;
        const { term, academicYear } = req.query;

        const query = { student: studentId };
        if (term) query.term = term;
        if (academicYear) query.academicYear = academicYear;

        const conducts = await Conduct.find(query)
            .populate('student', 'firstName lastName studentID');

        const deductions = await ConductDeduction.find({ student: studentId })
            .populate('fault', 'name pointsToDeduct')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: {
                conducts,
                deductions
            }
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

exports.getAllConducts = async (req, res) => {
    try {
        const { term, academicYear, status } = req.query;

        const query = {};
        if (term) query.term = term;
        if (academicYear) query.academicYear = academicYear;
        if (status) query.status = status;

        const conducts = await Conduct.find(query)
            .populate({
                path: 'student',
                select: 'firstName lastName studentID class',
                populate: {
                    path: 'class',
                    select: 'classID name'
                }
            })
            .sort({ remainingPoints: 1 });

        res.status(200).json({
            success: true,
            count: conducts.length,
            data: conducts
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

exports.getClassConducts = async (req, res) => {
    try {
        const { classId } = req.params;
        const { term, academicYear } = req.query;

        const classData = await Class.findById(classId).populate('students');
        if (!classData) {
            return res.status(404).json({
                success: false,
                error: 'Class not found'
            });
        }

        const studentIds = classData.students.map(s => s._id);

        const query = {
            student: { $in: studentIds }
        };
        if (term) query.term = term;
        if (academicYear) query.academicYear = academicYear;

        const conducts = await Conduct.find(query)
            .populate('student', 'firstName lastName studentID')
            .sort({ remainingPoints: 1 });

        res.status(200).json({
            success: true,
            class: classData,
            count: conducts.length,
            data: conducts
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

exports.getConductStatistics = async (req, res) => {
    try {
        const { term, academicYear } = req.query;

        const query = {};
        if (term) query.term = term;
        if (academicYear) query.academicYear = academicYear;

        const totalStudents = await Conduct.countDocuments(query);

        const statusCounts = await Conduct.aggregate([
            { $match: query },
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);

        const topFaults = await ConductDeduction.aggregate([
            { $match: term && academicYear ? { term, academicYear } : {} },
            {
                $group: {
                    _id: '$fault',
                    count: { $sum: 1 },
                    totalPointsDeducted: { $sum: '$pointsDeducted' }
                }
            },
            { $sort: { count: -1 } },
            { $limit: 10 }
        ]);

        const populatedFaults = await Fault.populate(topFaults, {
            path: '_id',
            select: 'name pointsToDeduct'
        });

        const averageConduct = await Conduct.aggregate([
            { $match: query },
            {
                $group: {
                    _id: null,
                    avgRemainingPoints: { $avg: '$remainingPoints' },
                    avgDeductions: { $avg: '$deductionsCount' }
                }
            }
        ]);

        res.status(200).json({
            success: true,
            data: {
                totalStudents,
                statusCounts,
                topFaults: populatedFaults,
                average: averageConduct[0] || { avgRemainingPoints: 0, avgDeductions: 0 }
            }
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};
