const Student = require('../models/Student');
const Class = require('../models/Class');

const generateStudentID = async (classId) => {
    const classData = await Class.findById(classId);
    if (!classData) {
        throw new Error('Class not found');
    }

    const currentYear = new Date().getFullYear();
    let prefix = '';

    if (classData.level === 'O-Level') {
        prefix = `${currentYear}OLC`;
    } else if (classData.level === 'A-Level') {
        prefix = `${currentYear}${classData.trade}`;
    }

    const lastStudent = await Student.findOne({
        studentID: { $regex: `^${prefix}` }
    }).sort({ studentID: -1 });

    let nextNumber = 1;
    if (lastStudent) {
        const lastNumber = parseInt(lastStudent.studentID.slice(-3));
        nextNumber = lastNumber + 1;
    }

    const studentID = `${prefix}${nextNumber.toString().padStart(3, '0')}`;
    return studentID;
};

exports.registerStudent = async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            gender,
            dateOfBirth,
            classId,
            parentName,
            parentPhone,
            relationship,
            parentEmail,
            address
        } = req.body;

        const studentID = await generateStudentID(classId);

        const newStudent = await Student.create({
            studentID,
            firstName,
            lastName,
            gender,
            dateOfBirth,
            class: classId,
            parentName,
            parentPhone,
            relationship,
            parentEmail,
            address
        });

        await Class.findByIdAndUpdate(classId, {
            $push: { students: newStudent._id }
        });

        res.status(201).json({
            success: true,
            data: newStudent
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

exports.getAllStudents = async (req, res) => {
    try {
        const students = await Student.find().populate('class', 'classID name');

        res.status(200).json({
            success: true,
            count: students.length,
            data: students
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

exports.getStudent = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id).populate('class', 'classID name');

        if (!student) {
            return res.status(404).json({
                success: false,
                error: 'Student not found'
            });
        }

        res.status(200).json({
            success: true,
            data: student
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

exports.updateStudent = async (req, res) => {
    try {
        const student = await Student.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!student) {
            return res.status(404).json({
                success: false,
                error: 'Student not found'
            });
        }

        res.status(200).json({
            success: true,
            data: student
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

exports.deleteStudent = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);

        if (!student) {
            return res.status(404).json({
                success: false,
                error: 'Student not found'
            });
        }

        await Class.findByIdAndUpdate(student.class, {
            $pull: { students: student._id }
        });

        await student.deleteOne();

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

exports.getStudentsByClass = async (req, res) => {
    try {
        const students = await Student.find({ class: req.params.classId })
            .populate('class', 'classID name');

        res.status(200).json({
            success: true,
            count: students.length,
            data: students
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};
