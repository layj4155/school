const Subject = require('../models/Subject');
const Class = require('../models/Class');

// Create a new subject and assign to all students in the class
exports.createSubject = async (req, res) => {
    try {
        const { name, code, class: classId, description } = req.body;
        const teacherId = req.body.teacher || req.user?.id;

        // Get the class and its students
        const classData = await Class.findById(classId).populate('students');
        
        if (!classData) {
            return res.status(404).json({
                success: false,
                error: 'Class not found'
            });
        }

        // Create subject with all students from the class
        const subject = await Subject.create({
            name,
            code,
            class: classId,
            teacher: teacherId,
            students: classData.students.map(student => student._id),
            description
        });

        const populatedSubject = await Subject.findById(subject._id)
            .populate('class', 'classID name')
            .populate('teacher', 'name email')
            .populate('students', 'firstName lastName studentID');

        res.status(201).json({
            success: true,
            data: populatedSubject
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

// Get all subjects (optionally filter by teacher or class)
exports.getSubjects = async (req, res) => {
    try {
        const { teacher, class: classId } = req.query;
        const filter = {};
        
        if (teacher) filter.teacher = teacher;
        if (classId) filter.class = classId;

        const subjects = await Subject.find(filter)
            .populate('class', 'classID name')
            .populate('teacher', 'name email')
            .populate('students', 'firstName lastName studentID');

        res.status(200).json({
            success: true,
            count: subjects.length,
            data: subjects
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

// Get subjects for a specific teacher
exports.getTeacherSubjects = async (req, res) => {
    try {
        const subjects = await Subject.find({ teacher: req.params.teacherId })
            .populate('class', 'classID name')
            .populate('teacher', 'name email')
            .populate('students', 'firstName lastName studentID');

        res.status(200).json({
            success: true,
            count: subjects.length,
            data: subjects
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

// Get a single subject
exports.getSubject = async (req, res) => {
    try {
        const subject = await Subject.findById(req.params.id)
            .populate('class', 'classID name')
            .populate('teacher', 'name email')
            .populate('students', 'firstName lastName studentID');

        if (!subject) {
            return res.status(404).json({
                success: false,
                error: 'Subject not found'
            });
        }

        res.status(200).json({
            success: true,
            data: subject
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

// Update a subject
exports.updateSubject = async (req, res) => {
    try {
        const subject = await Subject.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        ).populate('class', 'classID name')
         .populate('teacher', 'name email')
         .populate('students', 'firstName lastName studentID');

        if (!subject) {
            return res.status(404).json({
                success: false,
                error: 'Subject not found'
            });
        }

        res.status(200).json({
            success: true,
            data: subject
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

// Delete a subject
exports.deleteSubject = async (req, res) => {
    try {
        const subject = await Subject.findByIdAndDelete(req.params.id);

        if (!subject) {
            return res.status(404).json({
                success: false,
                error: 'Subject not found'
            });
        }

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

// Sync students: Add new students from class to subject
exports.syncSubjectStudents = async (req, res) => {
    try {
        const subject = await Subject.findById(req.params.id);
        
        if (!subject) {
            return res.status(404).json({
                success: false,
                error: 'Subject not found'
            });
        }

        const classData = await Class.findById(subject.class);
        
        if (!classData) {
            return res.status(404).json({
                success: false,
                error: 'Class not found'
            });
        }

        // Add any new students that aren't already in the subject
        const newStudents = classData.students.filter(
            studentId => !subject.students.includes(studentId)
        );

        if (newStudents.length > 0) {
            subject.students.push(...newStudents);
            await subject.save();
        }

        const updatedSubject = await Subject.findById(subject._id)
            .populate('class', 'classID name')
            .populate('teacher', 'name email')
            .populate('students', 'firstName lastName studentID');

        res.status(200).json({
            success: true,
            data: updatedSubject,
            added: newStudents.length
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};
