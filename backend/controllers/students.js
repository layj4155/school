const User = require('../models/User');

// @desc    Get all students
// @route   GET /api/students
// @access  Private (for authorized staff)
exports.getStudents = async (req, res, next) => {
    try {
        const students = await User.find({ role: 'Student' });
        res.status(200).json({ success: true, count: students.length, data: students });
    } catch (err) {
        res.status(400).json({ success: false });
    }
};

// @desc    Get single student
// @route   GET /api/students/:id
// @access  Private
exports.getStudent = async (req, res, next) => {
    try {
        const student = await Student.findById(req.params.id).populate('userAccount parentUserAccount');
        if (!student) {
            return res.status(404).json({ success: false, msg: 'Student not found' });
        }
        res.status(200).json({ success: true, data: student });
    } catch (err) {
        res.status(400).json({ success: false });
    }
};

// @desc    Create new student
// @route   POST /api/students
// @access  Private (for authorized staff)
exports.createStudent = async (req, res, next) => {
    try {
        const student = await Student.create(req.body);
        res.status(201).json({ success: true, data: student });
    } catch (err) {
        res.status(400).json({ success: false, msg: err.message });
    }
};

// @desc    Update student
// @route   PUT /api/students/:id
// @access  Private (for authorized staff)
exports.updateStudent = async (req, res, next) => {
    try {
        const student = await Student.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if (!student) {
            return res.status(404).json({ success: false, msg: 'Student not found' });
        }
        res.status(200).json({ success: true, data: student });
    } catch (err) {
        res.status(400).json({ success: false });
    }
};

// @desc    Delete student
// @route   DELETE /api/students/:id
// @access  Private (for authorized staff)
exports.deleteStudent = async (req, res, next) => {
    try {
        const student = await Student.findByIdAndDelete(req.params.id);

        if (!student) {
            return res.status(404).json({ success: false, msg: 'Student not found' });
        }
        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        res.status(400).json({ success: false });
    }
};