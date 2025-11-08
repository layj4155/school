const mongoose = require('mongoose');

const AnnouncementSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a title'],
        trim: true
    },
    content: {
        type: String,
        required: [true, 'Please add content']
    },
    concerns: {
        type: String,
        required: [true, 'Please specify who this concerns'],
        enum: ['Parents', 'Teachers', 'Staff', 'Students', 'All'],
        default: 'All'
    },
    image: {
        type: String
    },
    documents: [{
        type: String
    }],
    published: {
        type: Boolean,
        default: true
    },
    createdBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

AnnouncementSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Announcement', AnnouncementSchema);

