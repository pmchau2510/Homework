const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');

const documentSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
    },
    url: {
        type: String,
        required: true,
    },
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },

}, {
    timestamps: true,
});
documentSchema.plugin(mongooseDelete,{
    deletedAt: true,
    overrideMethods: 'all',
});

module.exports = mongoose.model('Document', documentSchema);