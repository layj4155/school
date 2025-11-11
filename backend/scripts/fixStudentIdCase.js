const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

async function fixIndex() {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        
        const db = mongoose.connection.db;
        const collection = db.collection('students');

        console.log('Getting all indexes...');
        const indexes = await collection.indexes();
        console.log('Current indexes:', indexes.map(i => i.name));

        // Drop the incorrect index (lowercase d)
        console.log('\nDropping incorrect studentId_1 index...');
        try {
            await collection.dropIndex('studentId_1');
            console.log('✅ Dropped studentId_1');
        } catch (err) {
            console.log('Index studentId_1 not found or already dropped');
        }

        // Drop any studentID index too
        try {
            await collection.dropIndex('studentID_1');
            console.log('✅ Dropped studentID_1');
        } catch (err) {
            console.log('Index studentID_1 not found');
        }

        // Create the correct index (uppercase D)
        console.log('\nCreating correct studentID index...');
        await collection.createIndex({ studentID: 1 }, { unique: true });
        console.log('✅ Created studentID_1 index (uppercase D)');

        // Delete any records with null studentID
        console.log('\nCleaning up null records...');
        const deleteResult = await collection.deleteMany({ 
            $or: [
                { studentID: null },
                { studentID: { $exists: false } }
            ]
        });
        console.log(`✅ Deleted ${deleteResult.deletedCount} records with null studentID`);

        console.log('\n✅ All done!');
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

fixIndex();
