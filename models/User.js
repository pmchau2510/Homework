const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    googleId: {
        type: String,
    },
    name: {
        type: String,
    },
    password: {
        type: String,
    },
    image: {
        type: String,
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('User', userSchema);