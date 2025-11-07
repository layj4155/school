const express = require('express');
const {
    getFinalReport
} = require('../controllers/reports');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

router.route('/final/:studentId').get(protect, authorize('DOS'), getFinalReport);

module.exports = router;