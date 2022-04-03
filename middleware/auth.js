const User = require('../models/User');
module.exports = {
    ensureAuth: (req, res, next) => {
        if (req.isAuthenticated()) {
            return next();
        } else {
            res.status(200).json({
                message: "You are not logged in"
            })
        }
    },
    ensureGuest: (req, res, next) => {
        if (req.isAuthenticated()) {
            res.status(400).json({ messsage: "You are logged in" });
        } else {
            return next();
        }
    },
    isAdmin: (req, res, next) => {
        if (req.isAuthenticated() && req.user.name == "admin") {
            return next();
        } else {
            res.status(200).json({ message: 'you do not have access' });
        }
    },
}