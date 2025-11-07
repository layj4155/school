const Class = require('../models/Class');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');

exports.createClass = async (req, res) => {
    try {
        const { level, trade, grade, section, classTeacher } = req.body;

        let classID = '';
        let name = '';
        
        if (level === 'O-Level') {
            classID = section ? `${grade}${section}` : grade;
            name = section ? `${grade} ${section}` : grade;
        } else if (level === 'A-Level') {
            if (trade === 'SOD') {
                classID = section ? `${grade} SOD ${section}` : `${grade} SOD`;
                name = section ? `${grade} SOD ${section}` : `${grade} SOD`;
            } else if (trade === 'ACC') {
                classID = section ? `${grade} ACC ${section}` : `${grade} ACC`;
                name = section ? `${grade} ACC ${section}` : `${grade} ACC`;
            }
        }

        const classData = {
            classID,
            name,
            level,
            trade: trade || 'None',
            grade,
            section: section || null
        };

        if (classTeacher) {
            classData.classTeacher = classTeacher;
        }

        const newClass = await Class.create(classData);

        const populatedClass = await Class.findById(newClass._id)
            .populate('classTeacher', 'name email');

        res.status(201).json({
            success: true,
            data: populatedClass
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

exports.getAllClasses = async (req, res) => {
    try {
        const classes = await Class.find()
            .populate('classTeacher', 'name email')
            .populate('students', 'firstName lastName studentID');

        res.status(200).json({
            success: true,
            count: classes.length,
            data: classes
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

exports.getClass = async (req, res) => {
    try {
        const classData = await Class.findById(req.params.id)
            .populate('classTeacher', 'name email')
            .populate('students', 'firstName lastName studentID');

        if (!classData) {
            return res.status(404).json({
                success: false,
                error: 'Class not found'
            });
        }

        res.status(200).json({
            success: true,
            data: classData
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

exports.updateClass = async (req, res) => {
    try {
        const classData = await Class.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!classData) {
            return res.status(404).json({
                success: false,
                error: 'Class not found'
            });
        }

        res.status(200).json({
            success: true,
            data: classData
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

exports.deleteClass = async (req, res) => {
    try {
        const classData = await Class.findByIdAndDelete(req.params.id);

        if (!classData) {
            return res.status(404).json({
                success: false,
                error: 'Class not found'
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

exports.assignClassTeacher = async (req, res) => {
    try {
        const { teacherId } = req.body;

        const teacher = await Teacher.findById(teacherId);
        if (!teacher) {
            return res.status(404).json({
                success: false,
                error: 'Teacher not found'
            });
        }

        const classData = await Class.findByIdAndUpdate(
            req.params.id,
            { classTeacher: teacherId },
            { new: true, runValidators: true }
        ).populate('classTeacher', 'name email');

        if (!classData) {
            return res.status(404).json({
                success: false,
                error: 'Class not found'
            });
        }

        res.status(200).json({
            success: true,
            data: classData
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

exports.assignStudentToClass = async (req, res) => {
    try {
        const { studentId } = req.body;

        const student = await Student.findById(studentId);
        if (!student) {
            return res.status(404).json({
                success: false,
                error: 'Student not found'
            });
        }

        const classData = await Class.findById(req.params.id);
        if (!classData) {
            return res.status(404).json({
                success: false,
                error: 'Class not found'
            });
        }

        if (!classData.students.includes(studentId)) {
            classData.students.push(studentId);
            await classData.save();
        }

        await Student.findByIdAndUpdate(studentId, { class: req.params.id });

        res.status(200).json({
            success: true,
            data: classData
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};
