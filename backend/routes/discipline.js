const express = require('express');
const {
    getDisciplineReports,
    createDisciplineReport,
    getConductScores,
    getLowConduct,
    publishDisciplineReport,
    getDisciplineSummary
} = require('../controllers/discipline');

const Discipline = require('../models/Discipline');
const advancedResults = require('../middleware/advancedResults');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.route('/')
    .get(protect, authorize('DOS', 'DOD'), advancedResults(Discipline, {
        path: 'student reportedBy',
        select: 'name'
    }), getDisciplineReports)
    .post(protect, authorize('DOD'), createDisciplineReport);

// Conduct scores (40 base minus reductions)
router.get('/conduct', protect, authorize('DOS', 'DOD', 'SM'), getConductScores);

// Low conduct (< 20)
router.get('/low', protect, authorize('DOS', 'DOD', 'SM'), getLowConduct);

// Publish discipline summary to DOS, SM
router.post('/publish/:studentId', protect, authorize('DOD'), publishDisciplineReport);

// Get published summary
router.get('/summary/:studentId', protect, authorize('DOS', 'DOD', 'SM'), getDisciplineSummary);

module.exports = router;