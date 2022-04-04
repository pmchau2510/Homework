const mongoose = require('mongoose');
const documentSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    url: {
        type: String,
    },
    postedBy: {
        type: String,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Document', documentSchema);