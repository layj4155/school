const express = require('express');
const {
    getPerformanceData,
    getOverallPerformanceData
} = require('../controllers/performance');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

router.route('/').get(protect, authorize('DOS'), getPerformanceData);
router.route('/overall').get(protect, authorize('DOS'), getOverallPerformanceData);

module.exports = router;