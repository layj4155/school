const User = require('../models/User');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const News = require('../models/News');
const Announcement = require('../models/Announcement');
const EmployeeOfYear = require('../models/EmployeeOfYear');
const PageContent = require('../models/PageContent');

exports.uploadFile = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                error: 'No file uploaded'
            });
        }

        const fileUrl = `/uploads/${req.file.filename}`;
        
        res.status(200).json({
            success: true,
            data: {
                url: fileUrl,
                filename: req.file.filename,
                originalName: req.file.originalname,
                mimetype: req.file.mimetype,
                size: req.file.size
            }
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

// Get all users for management
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password').sort({ createdAt: -1 });
        
        res.status(200).json({
            success: true,
            count: users.length,
            data: users
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

// Get single user
exports.getUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        
        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }
        
        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

// Update user
exports.updateUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        ).select('-password');

        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

// Delete user
exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }

        await user.deleteOne();

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

// Create announcement
exports.createAnnouncement = async (req, res) => {
    try {
        req.body.createdBy = req.user.id;
        const announcement = await Announcement.create(req.body);
        
        res.status(201).json({
            success: true,
            data: announcement
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

// Get all announcements
exports.getAllAnnouncements = async (req, res) => {
    try {
        const { concerns, published } = req.query;
        let query = {};
        
        if (concerns) query.concerns = concerns;
        if (published !== undefined) query.published = published === 'true';
        
        const announcements = await Announcement.find(query)
            .populate('createdBy', 'name')
            .sort({ createdAt: -1 });
        
        res.status(200).json({
            success: true,
            count: announcements.length,
            data: announcements
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

// Update announcement
exports.updateAnnouncement = async (req, res) => {
    try {
        const announcement = await Announcement.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!announcement) {
            return res.status(404).json({
                success: false,
                error: 'Announcement not found'
            });
        }

        res.status(200).json({
            success: true,
            data: announcement
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

// Delete announcement
exports.deleteAnnouncement = async (req, res) => {
    try {
        const announcement = await Announcement.findById(req.params.id);

        if (!announcement) {
            return res.status(404).json({
                success: false,
                error: 'Announcement not found'
            });
        }

        await announcement.deleteOne();

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

// Create employee of year
exports.createEmployeeOfYear = async (req, res) => {
    try {
        req.body.createdBy = req.user.id;
        
        // Validate required fields
        if (!req.body.employeeType || !req.body.employee) {
            return res.status(400).json({
                success: false,
                error: 'Employee type and employee are required'
            });
        }
        
        // Get employee name based on type
        if (req.body.employeeType === 'Teacher') {
            // Teachers are stored as User documents with role 'Teacher'
            const teacher = await User.findById(req.body.employee);
            if (!teacher) {
                return res.status(400).json({
                    success: false,
                    error: 'Teacher not found'
                });
            }
            // Verify it's actually a teacher
            if (teacher.role !== 'Teacher') {
                return res.status(400).json({
                    success: false,
                    error: 'Selected user is not a teacher'
                });
            }
            req.body.employeeName = teacher.name;
            req.body.employeeModel = 'User'; // Teachers are stored in User collection
        } else if (req.body.employeeType === 'Staff') {
            const user = await User.findById(req.body.employee);
            if (!user) {
                return res.status(400).json({
                    success: false,
                    error: 'Staff member not found'
                });
            }
            req.body.employeeName = user.name;
            req.body.employeeModel = 'User';
        } else {
            return res.status(400).json({
                success: false,
                error: 'Invalid employee type'
            });
        }
        
        const employeeOfYear = await EmployeeOfYear.create(req.body);
        
        res.status(201).json({
            success: true,
            data: employeeOfYear
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

// Get all employees of year
exports.getAllEmployeesOfYear = async (req, res) => {
    try {
        const { year, published } = req.query;
        let query = {};
        
        if (year) query.year = year;
        if (published !== undefined) query.published = published === 'true';
        
        const employees = await EmployeeOfYear.find(query)
            .populate('employee')
            .populate('createdBy', 'name')
            .sort({ year: -1, createdAt: -1 });
        
        res.status(200).json({
            success: true,
            count: employees.length,
            data: employees
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

// Update employee of year
exports.updateEmployeeOfYear = async (req, res) => {
    try {
        const employee = await EmployeeOfYear.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!employee) {
            return res.status(404).json({
                success: false,
                error: 'Employee of year not found'
            });
        }

        res.status(200).json({
            success: true,
            data: employee
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

// Delete employee of year
exports.deleteEmployeeOfYear = async (req, res) => {
    try {
        const employee = await EmployeeOfYear.findById(req.params.id);

        if (!employee) {
            return res.status(404).json({
                success: false,
                error: 'Employee of year not found'
            });
        }

        await employee.deleteOne();

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

// Create page content
exports.createPageContent = async (req, res) => {
    try {
        req.body.createdBy = req.user.id;
        const pageContent = await PageContent.create(req.body);
        
        res.status(201).json({
            success: true,
            data: pageContent
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

// Get page content
exports.getPageContent = async (req, res) => {
    try {
        const { page, published } = req.query;
        let query = {};
        
        if (page) query.page = page;
        if (published !== undefined) query.published = published === 'true';
        
        const contents = await PageContent.find(query)
            .populate('createdBy', 'name')
            .sort({ order: 1, createdAt: -1 });
        
        res.status(200).json({
            success: true,
            count: contents.length,
            data: contents
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

// Update page content
exports.updatePageContent = async (req, res) => {
    try {
        const content = await PageContent.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!content) {
            return res.status(404).json({
                success: false,
                error: 'Page content not found'
            });
        }

        res.status(200).json({
            success: true,
            data: content
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

// Delete page content
exports.deletePageContent = async (req, res) => {
    try {
        const content = await PageContent.findById(req.params.id);

        if (!content) {
            return res.status(404).json({
                success: false,
                error: 'Page content not found'
            });
        }

        await content.deleteOne();

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

