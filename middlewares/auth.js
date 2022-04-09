const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler');
const User = require('../models/User');
module.exports = {

    isAdmin: (req, res, next) => {
        if (req.isAuthenticated() && req.user.role == 9) {
            return next();
        } else {
            res.status(400).json({ message: 'You do not have access' });
        }
    },
    isUser: (req, res, next) => {
        if (req.user.role == 0) {
            return next();
        } else {
            res.status(400).json({ message: 'You do not have access' });
        }
    },
    authenticationMiddleware: asyncHandler(async(req, res, next) => {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(400).json({ msg: "No token provided" });
        }
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // console.log(req.user);
        // console.log(decoded.id)
        req.user = await User.findById(decoded.id).select('-password');
        next();
    }),
}