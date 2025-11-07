const express = require('express');
const router = express.Router();

const {
    createFault,
    getAllFaults,
    getFault,
    updateFault,
    deleteFault
} = require('../controllers/dodFaultController');

const {
    deductFromStudents,
    deductFromClass,
    getLowConductAlerts,
    getStudentConduct,
    getAllConducts,
    getClassConducts,
    getConductStatistics
} = require('../controllers/dodConductController');

const {
    publishDisciplineReport,
    getPublishedReports,
    getStudentDisciplineReport
} = require('../controllers/dodPublishController');

const Student = require('../models/Student');

router.post('/faults', createFault);
router.get('/faults', getAllFaults);
router.get('/faults/:id', getFault);
router.put('/faults/:id', updateFault);
router.delete('/faults/:id', deleteFault);

router.post('/deduct/students', deductFromStudents);
router.post('/deduct/class', deductFromClass);

router.get('/conducts', getAllConducts);
router.get('/conducts/student/:studentId', getStudentConduct);
router.get('/conducts/class/:classId', getClassConducts);
router.get('/conducts/alerts', getLowConductAlerts);
router.get('/conducts/statistics', getConductStatistics);

router.post('/publish', publishDisciplineReport);
router.get('/published', getPublishedReports);
router.get('/report/student/:studentId', getStudentDisciplineReport);

router.get('/students', async (req, res) => {
    try {
        const students = await Student.find()
            .populate('class', 'classID name')
            .select('firstName lastName studentID class');

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
});

module.exports = router;
