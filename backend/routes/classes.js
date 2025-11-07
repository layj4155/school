const express = require('express');
const {
    getClasses,
    getClass,
    createClass,
    updateClass,
    deleteClass,
    addStudentToClass
} = require('../controllers/classes');

const Class = require('../models/Class');
const advancedResults = require('../middleware/advancedResults');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router
    .route('/')
    .get(authorize('DOS', 'SM', 'DOD'), advancedResults(Class, 'students'), getClasses)
    .post(authorize('DOS', 'SM'), createClass);

router
    .route('/:id')
    .get(authorize('DOS', 'SM', 'DOD'), getClass)
    .put(authorize('DOS', 'SM'), updateClass)
    .delete(authorize('DOS', 'SM'), deleteClass);

router.route('/:id/students').post(authorize('DOS', 'SM'), addStudentToClass);

module.exports = router;