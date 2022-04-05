const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler');
const User = require('../models/User');
module.exports = {
    ensureGuest: (req, res, next) => {
        if (req.isAuthenticated()) {
            res.status(400).json({ messsage: "You are logged in" });
        } else {
            return next();
        }
    },
    isAdmin: (req, res, next) => {
        if (req.isAuthenticated() && req.user.role == 9) {
            return next();
        } else {
            res.status(200).json({ message: 'you do not have access' });
        }
    },
    authenticationMiddleware: asyncHandler(async(req, res, next) => {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(400).json({ msg: "No token provided" });
        }
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.user._id).select('-password');
        next();
    }),
}