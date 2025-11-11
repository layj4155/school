const express = require('express');
const router = express.Router();
const User = require('../models/User');

const {
    createClass,
    getAllClasses,
    getClass,
    updateClass,
    deleteClass,
    assignClassTeacher,
    assignStudentToClass
} = require('../controllers/dosClassController');

const {
    registerStudent,
    getAllStudents,
    getStudent,
    updateStudent,
    deleteStudent,
    getStudentsByClass,
    getNextStudentID
} = require('../controllers/dosStudentController');

const {
    addMarks,
    updateMark,
    publishMarks,
    getMarksByClass,
    getStudentMarks,
    deleteMark
} = require('../controllers/dosMarksController');

const {
    getClassPerformance,
    getSchoolPerformance,
    publishBestPerformers
} = require('../controllers/dosPerformanceController');

const {
    createSubject,
    getSubjects,
    getTeacherSubjects,
    getSubject,
    updateSubject,
    deleteSubject,
    syncSubjectStudents
} = require('../controllers/subjectController');

router.post('/classes', createClass);
router.get('/classes', getAllClasses);
router.get('/classes/:id', getClass);
router.put('/classes/:id', updateClass);
router.delete('/classes/:id', deleteClass);
router.put('/classes/:id/assign-teacher', assignClassTeacher);
router.put('/classes/:id/assign-student', assignStudentToClass);

router.post('/students', registerStudent);
router.get('/students', getAllStudents);
router.get('/students/next-id/:classId', getNextStudentID);
router.get('/students/:id', getStudent);
router.put('/students/:id', updateStudent);
router.delete('/students/:id', deleteStudent);
router.get('/students/class/:classId', getStudentsByClass);

router.get('/marks', async (req, res) => {
    try {
        const Mark = require('../models/Mark');
        const marks = await Mark.find()
            .populate('student', 'firstName lastName studentID')
            .populate('class', 'classID name')
            .populate('createdBy', 'name email')
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
});
router.post('/marks', addMarks);
router.put('/marks/:id', updateMark);
router.delete('/marks/:id', deleteMark);
router.post('/marks/publish', publishMarks);
router.get('/marks/class/:classId', getMarksByClass);
router.get('/marks/student/:studentId', getStudentMarks);

router.get('/performance/class/:classId', getClassPerformance);
router.get('/performance/school', getSchoolPerformance);
router.post('/performance/publish-best', publishBestPerformers);

router.get('/teachers', async (req, res) => {
    try {
        const teachers = await User.find({ role: 'Teacher' }).select('name email');
        res.status(200).json({
            success: true,
            count: teachers.length,
            data: teachers
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
});

router.get('/my-classes/:teacherId', async (req, res) => {
    try {
        const Class = require('../models/Class');
        const classes = await Class.find({ classTeacher: req.params.teacherId })
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
});

// Subject routes
router.post('/subjects', createSubject);
router.get('/subjects', getSubjects);
router.get('/subjects/teacher/:teacherId', getTeacherSubjects);
router.get('/subjects/:id', getSubject);
router.put('/subjects/:id', updateSubject);
router.delete('/subjects/:id', deleteSubject);
router.post('/subjects/:id/sync-students', syncSubjectStudents);

module.exports = router;
