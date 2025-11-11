const Student = require('../models/Student');
const Class = require('../models/Class');

const generateStudentID = async (classId) => {
    const classData = await Class.findById(classId);
    if (!classData) {
        throw new Error('Class not found');
    }

    const currentYear = new Date().getFullYear();
    let prefix = '';

    if (classData.level === 'O-Level') {
        prefix = `${currentYear}OLC`;
    } else if (classData.level === 'A-Level') {
        prefix = `${currentYear}${classData.trade}`;
    }

    console.log('Generating ID with prefix:', prefix);

    // Get all students with this prefix
    const students = await Student.find({
        studentID: { $regex: `^${prefix}` }
    }).select('studentID');

    console.log(`Found ${students.length} existing students with prefix ${prefix}`);
    
    if (students.length > 0) {
        console.log('Existing student IDs:', students.map(s => s.studentID));
    }

    let nextNumber = 1;
    if (students.length > 0) {
        // Find the highest number used
        const numbers = students.map(s => {
            const match = s.studentID.match(/(\d{3})$/);
            return match ? parseInt(match[1]) : 0;
        });
        console.log('Extracted numbers:', numbers);
        const maxNumber = Math.max(...numbers);
        console.log('Max number found:', maxNumber);
        nextNumber = maxNumber + 1;
    }

    console.log('Next number will be:', nextNumber);

    // Try up to 10 times to find a unique ID
    for (let attempt = 0; attempt < 10; attempt++) {
        const studentID = `${prefix}${(nextNumber + attempt).toString().padStart(3, '0')}`;
        console.log('Checking if ID exists:', studentID);
        
        const exists = await Student.findOne({ studentID });
        if (!exists) {
            console.log('✅ Generated unique ID:', studentID);
            return studentID;
        }
        console.log('❌ ID already exists, trying next...');
    }
    
    throw new Error('Unable to generate unique student ID after 10 attempts');
};

exports.registerStudent = async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            gender,
            dateOfBirth,
            classId,
            parentName,
            parentPhone,
            relationship,
            parentEmail,
            address
        } = req.body;

        console.log('Registering student with classId:', classId);
        
        const studentID = await generateStudentID(classId);
        console.log('Generated studentID:', studentID);

        const newStudent = await Student.create({
            studentID,
            firstName,
            lastName,
            gender,
            dateOfBirth,
            class: classId,
            parentName,
            parentPhone,
            relationship,
            parentEmail,
            address
        });

        await Class.findByIdAndUpdate(classId, {
            $push: { students: newStudent._id }
        });

        res.status(201).json({
            success: true,
            data: newStudent
        });
    } catch (error) {
        console.error('Error registering student:', error);
        
        // Better error message for duplicate key errors
        if (error.code === 11000) {
            const field = Object.keys(error.keyPattern)[0];
            return res.status(400).json({
                success: false,
                error: `A student with this ${field} already exists`
            });
        }
        
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

exports.getAllStudents = async (req, res) => {
    try {
        const students = await Student.find().populate('class', 'classID name');

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
};

exports.getStudent = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id).populate('class', 'classID name');

        if (!student) {
            return res.status(404).json({
                success: false,
                error: 'Student not found'
            });
        }

        res.status(200).json({
            success: true,
            data: student
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

exports.updateStudent = async (req, res) => {
    try {
        const { classId, ...updateData } = req.body;
        const student = await Student.findById(req.params.id);

        if (!student) {
            return res.status(404).json({
                success: false,
                error: 'Student not found'
            });
        }

        // Handle class change if classId is provided
        const oldClassId = student.class ? student.class.toString() : null;
        if (classId && classId !== oldClassId) {
            // Remove student from old class
            if (oldClassId) {
                await Class.findByIdAndUpdate(oldClassId, {
                    $pull: { students: student._id }
                });
            }
            
            // Add student to new class
            await Class.findByIdAndUpdate(classId, {
                $addToSet: { students: student._id }
            });
            
            updateData.class = classId;
        }

        // Update student data
        const updatedStudent = await Student.findByIdAndUpdate(
            req.params.id,
            updateData,
            {
                new: true,
                runValidators: true
            }
        ).populate('class', 'classID name');

        res.status(200).json({
            success: true,
            data: updatedStudent
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

exports.deleteStudent = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);

        if (!student) {
            return res.status(404).json({
                success: false,
                error: 'Student not found'
            });
        }

        await Class.findByIdAndUpdate(student.class, {
            $pull: { students: student._id }
        });

        await student.deleteOne();

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

exports.getStudentsByClass = async (req, res) => {
    try {
        const students = await Student.find({ class: req.params.classId })
            .populate('class', 'classID name');

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
};

exports.getNextStudentID = async (req, res) => {
    try {
        const nextStudentID = await generateStudentID(req.params.classId);

        res.status(200).json({
            success: true,
            data: {
                nextStudentID
            }
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};
