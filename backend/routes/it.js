const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');
const {
    uploadFile,
    getAllUsers,
    getUser,
    updateUser,
    deleteUser,
    createAnnouncement,
    getAllAnnouncements,
    updateAnnouncement,
    deleteAnnouncement,
    createEmployeeOfYear,
    getAllEmployeesOfYear,
    updateEmployeeOfYear,
    deleteEmployeeOfYear,
    createPageContent,
    getPageContent,
    updatePageContent,
    deletePageContent
} = require('../controllers/itController');

// File upload route
router.post('/upload', protect, authorize('IT', 'SM', 'DOS', 'DOD', 'Teacher', 'Patron', 'Matron'), upload.single('file'), uploadFile);

// User management routes
router.get('/users', protect, authorize('IT', 'SM'), getAllUsers);
router.get('/users/:id', protect, authorize('IT', 'SM'), getUser);
router.put('/users/:id', protect, authorize('IT', 'SM'), updateUser);
router.delete('/users/:id', protect, authorize('IT'), deleteUser);

// Announcement routes
router.post('/announcements', protect, authorize('IT', 'SM'), createAnnouncement);
router.get('/announcements', getAllAnnouncements);
router.put('/announcements/:id', protect, authorize('IT', 'SM'), updateAnnouncement);
router.delete('/announcements/:id', protect, authorize('IT'), deleteAnnouncement);

// Employee of Year routes
router.post('/employee-of-year', protect, authorize('IT', 'SM'), createEmployeeOfYear);
router.get('/employee-of-year', getAllEmployeesOfYear);
router.put('/employee-of-year/:id', protect, authorize('IT', 'SM'), updateEmployeeOfYear);
router.delete('/employee-of-year/:id', protect, authorize('IT'), deleteEmployeeOfYear);

// Page Content routes
router.post('/page-content', protect, authorize('IT'), createPageContent);
router.get('/page-content', getPageContent);
router.put('/page-content/:id', protect, authorize('IT'), updatePageContent);
router.delete('/page-content/:id', protect, authorize('IT'), deletePageContent);

module.exports = router;

