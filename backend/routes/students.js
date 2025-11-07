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

// Student login (no password - just ID and name)
router.post('/student-login', async (req, res) => {
    try {
        const { studentId, studentName } = req.body;
        
        const student = await Student.findOne({ 
            studentId: studentId,
            name: studentName 
        });
        
        if (!student) {
            return res.status(401).json({
                success: false,
                msg: 'Invalid Student ID or Name'
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
            msg: 'Server Error',
            error: error.message
        });
    }
});

// Parent login (verify studentId, studentName, class, and parentName)
router.post('/parent-login', async (req, res) => {
    try {
        const { studentId, studentName, studentClass, parentName } = req.body;
        
        const student = await Student.findOne({ 
            studentId: studentId,
            name: studentName,
            class: studentClass,
            parentName: parentName
        });
        
        if (!student) {
            return res.status(401).json({
                success: false,
                msg: 'Invalid credentials. Please check all details match our records.'
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
            msg: 'Server Error',
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