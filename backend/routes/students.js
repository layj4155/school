const express = require('express');
const {
    getStudents,
    getStudent,
    createStudent,
    updateStudent,
    deleteStudent
} = require('../controllers/students');
const Student = require('../models/Student');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

// Student login (no password - just ID, class, first name and last name)
router.post('/student-login', async (req, res) => {
    try {
        const { studentId, classId, firstName, lastName } = req.body;
        
        if (!studentId || !classId || !firstName || !lastName) {
            return res.status(400).json({
                success: false,
                message: 'Please provide Student ID, Class, First Name, and Last Name'
            });
        }
        
        const student = await Student.findOne({ 
            studentID: studentId.toUpperCase(),
            class: classId,
            firstName: { $regex: new RegExp(`^${firstName}$`, 'i') },
            lastName: { $regex: new RegExp(`^${lastName}$`, 'i') }
        }).populate('class', 'classID name');
        
        if (!student) {
            return res.status(401).json({
                success: false,
                message: 'Invalid Student ID or Name. Please contact the Dean of Studies if you believe this is an error.'
            });
        }
        
        res.status(200).json({
            success: true,
            data: {
                student: student,
                role: 'Student'
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
});

// Parent login (verify studentId, firstName, lastName, class, and parentName)
router.post('/parent-login', async (req, res) => {
    try {
        const { studentId, classId, firstName, lastName, parentName } = req.body;
        
        if (!studentId || !classId || !firstName || !lastName || !parentName) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required information'
            });
        }
        
        const student = await Student.findOne({ 
            studentID: studentId.toUpperCase(),
            class: classId,
            firstName: { $regex: new RegExp(`^${firstName}$`, 'i') },
            lastName: { $regex: new RegExp(`^${lastName}$`, 'i') },
            parentName: { $regex: new RegExp(`^${parentName}$`, 'i') }
        }).populate('class', 'classID name');
        
        if (!student) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials. Please contact the Dean of Studies if you believe this is an error.'
            });
        }
        
        res.status(200).json({
            success: true,
            data: {
                student: student,
                role: 'Parent'
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
});

router.route('/')
    .get(protect, authorize('SM', 'DOS', 'DOD', 'IT', 'Teacher', 'Librarian', 'Bursar', 'Patron', 'Matron'), getStudents)
    .post(protect, authorize('SM', 'DOS', 'IT'), createStudent);

router.route('/:id')
    .get(protect, getStudent)
    .put(protect, authorize('SM', 'DOS', 'IT'), updateStudent)
    .delete(protect, authorize('SM', 'IT'), deleteStudent);

module.exports = router;