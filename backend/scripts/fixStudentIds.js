const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Student = require('../models/Student');

dotenv.config({ path: path.join(__dirname, '../.env') });

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

async function fixStudentIds() {
    try {
        // Find all students with null or empty studentID
        const studentsWithoutId = await Student.find({
            $or: [
                { studentID: null },
                { studentID: '' },
                { studentID: { $exists: false } }
            ]
        });

        console.log(`Found ${studentsWithoutId.length} students without proper IDs`);

        if (studentsWithoutId.length > 0) {
            console.log('Deleting students with invalid IDs...');
            await Student.deleteMany({
                $or: [
                    { studentID: null },
                    { studentID: '' },
                    { studentID: { $exists: false } }
                ]
            });
            console.log('✅ Deleted students with invalid IDs');
        } else {
            console.log('✅ No students with invalid IDs found');
        }

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

fixStudentIds();
