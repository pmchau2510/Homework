const mongoose = require('mongoose');
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


module.exports = mongoose.model('User', userSchema);