const mongoose = require('mongoose');
const mongoose_delete = require('mongoose-delete');
const userSchema = new mongoose.Schema({
    socialId: {
        type: String,
    },
    name: {
        type: String,
    },
    password: {
        type: String,
    },
    avatar: {
        type: String,
    },
    role: {
        type: Number,
        required: true,
        default: 0
    },
}, {
    timestamps: true,
});

userSchema.plugin(mongoose_delete);

module.exports = mongoose.model('User', userSchema);