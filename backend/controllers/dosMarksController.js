const Mark = require('../models/Mark');
const Student = require('../models/Student');
const Class = require('../models/Class');
const News = require('../models/News');

exports.addMarks = async (req, res) => {
    try {
        const { classId, assessmentType, term, academicYear, marks } = req.body;

        const classData = await Class.findById(classId);
        if (!classData) {
            return res.status(404).json({
                success: false,
                error: 'Class not found'
            });
        }

        const createdMarks = [];
        for (const markData of marks) {
            const { studentId, subject, score } = markData;

            const student = await Student.findById(studentId);
            if (!student) {
                continue;
            }

            const mark = await Mark.create({
                student: studentId,
                class: classId,
                subject,
                assessmentType,
                marks: score,
                term,
                academicYear,
                createdBy: req.user ? req.user.id : null
            });

            createdMarks.push(mark);
        }

        res.status(201).json({
            success: true,
            count: createdMarks.length,
            data: createdMarks
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

exports.updateMark = async (req, res) => {
    try {
        const mark = await Mark.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!mark) {
            return res.status(404).json({
                success: false,
                error: 'Mark not found'
            });
        }

        res.status(200).json({
            success: true,
            data: mark
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

exports.publishMarks = async (req, res) => {
    try {
        const { classId, assessmentType, term, academicYear } = req.body;

        const result = await Mark.updateMany(
            {
                class: classId,
                assessmentType,
                term,
                academicYear,
                published: false
            },
            {
                published: true,
                publishedAt: new Date()
            }
        );

        res.status(200).json({
            success: true,
            message: `Published ${result.modifiedCount} marks`,
            data: result
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

exports.getMarksByClass = async (req, res) => {
    try {
        const { classId } = req.params;
        const { assessmentType, term, academicYear } = req.query;

        const query = { class: classId };
        if (assessmentType) query.assessmentType = assessmentType;
        if (term) query.term = term;
        if (academicYear) query.academicYear = academicYear;

        const marks = await Mark.find(query)
            .populate('student', 'firstName lastName studentID')
            .populate('class', 'classID name');

        res.status(200).json({
            success: true,
            count: marks.length,
            data: marks
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

exports.getStudentMarks = async (req, res) => {
    try {
        const { studentId } = req.params;
        const { term, academicYear, published } = req.query;

        const query = { student: studentId };
        if (term) query.term = term;
        if (academicYear) query.academicYear = academicYear;
        if (published !== undefined) query.published = published === 'true';

        const marks = await Mark.find(query)
            .populate('class', 'classID name')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: marks.length,
            data: marks
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

exports.deleteMark = async (req, res) => {
    try {
        const mark = await Mark.findByIdAndDelete(req.params.id);

        if (!mark) {
            return res.status(404).json({
                success: false,
                error: 'Mark not found'
            });
        }

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};
