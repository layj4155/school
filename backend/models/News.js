const mongoose = require('mongoose');

const NewsSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a title'],
        trim: true
    },
    content: {
        type: String,
        required: [true, 'Please add content']
    },
    excerpt: {
        type: String
    },
    image: {
        type: String
    },
    author: {
        type: String,
        required: [true, 'Please add author name']
    },
    category: {
        type: String,
        enum: ['Events', 'Announcements', 'Achievements', 'News', 'General'],
        default: 'News'
    },
    published: {
        type: Boolean,
        default: true
    },
    featured: {
        type: Boolean,
        default: false
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

// Generate excerpt if not provided
NewsSchema.pre('save', function(next) {
    if (!this.excerpt && this.content) {
        this.excerpt = this.content.substring(0, 200) + '...';
    }
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('News', NewsSchema);
