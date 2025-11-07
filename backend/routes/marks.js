const express = require('express');
const {
    getMarks,
    getMark,
    addMark,
    updateMark,
    deleteMark
} = require('../controllers/marks');

const Mark = require('../models/Mark');
const advancedResults = require('../middleware/advancedResults');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);
router.use(authorize('DOS', 'Teacher', 'Admin'));

router
    .route('/')
    .get(advancedResults(Mark, {
        path: 'student',
        select: 'name'
    }), getMarks)
    .post(addMark);

router
    .route('/:id')
    .get(getMark)
    .put(updateMark)
    .delete(deleteMark);

module.exports = router;