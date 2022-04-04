const mongoose = require('mongoose');
const confirmSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    document: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Document'
    },
    status: {
        type: String,
        default: 'Open'
    },

}, {
    timestamps: true,
});

module.exports = mongoose.model('Confirm', confirmSchema);