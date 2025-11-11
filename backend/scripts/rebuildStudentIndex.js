const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

async function rebuildIndex() {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        
        const db = mongoose.connection.db;
        const collection = db.collection('students');

        console.log('Dropping studentID index...');
        try {
            await collection.dropIndex('studentID_1');
            console.log('✅ Index dropped');
        } catch (err) {
            console.log('Index does not exist or already dropped');
        }

        console.log('Recreating studentID index...');
        await collection.createIndex({ studentID: 1 }, { unique: true });
        console.log('✅ Index recreated successfully');

        console.log('\nChecking for problematic records...');
        const nullStudents = await collection.find({ studentID: null }).toArray();
        console.log(`Found ${nullStudents.length} students with null studentID`);

        if (nullStudents.length > 0) {
            console.log('Deleting students with null IDs...');
            await collection.deleteMany({ studentID: null });
            console.log('✅ Deleted');
        }

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

rebuildIndex();
