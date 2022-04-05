const mongoose = require('mongoose');
const mongoose_delete = require('mongoose-delete');

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
documentSchema.plugin(mongoose_delete);

module.exports = mongoose.model('Document', documentSchema);