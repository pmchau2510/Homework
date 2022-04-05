const mongoose = require('mongoose');
const mongoose_delete = require('mongoose-delete');


const confirmSchema = new mongoose.Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    docId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Document',
    },
    status: {
        type: String,
        required: true,
        default: 'Open',
    },

}, {
    timestamps: true,
});
confirmSchema.plugin(mongoose_delete);
module.exports = mongoose.model('Confirm', confirmSchema);