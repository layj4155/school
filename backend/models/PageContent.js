const mongoose = require('mongoose');

const PageContentSchema = new mongoose.Schema({
    page: {
        type: String,
        required: [true, 'Please specify the page'],
        enum: ['Home', 'About', 'Academics', 'Admissions', 'Contact', 'Other']
    },
    title: {
        type: String,
        required: [true, 'Please add a title'],
        trim: true
    },
    content: {
        type: String,
        required: [true, 'Please add content']
    },
    images: [{
        type: String
    }],
    documents: [{
        type: String
    }],
    order: {
        type: Number,
        default: 0
    },
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

PageContentSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('PageContent', PageContentSchema);

