const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/User');
const bcrypt = require('bcrypt');
// const { ensureGuest } = require('../middleware/auth');
const asyncHandler = require('express-async-handler');

const jwt = require('jsonwebtoken');
// Auth with Google
// GET /auth/google

router.get('/google', passport.authenticate('google', { scope: ['profile'] }));


// Googlee auth callback
//GET /auth/google/callback

router.get('/google/callback', passport.authenticate('google'), (req, res) => {
    const token = jwt.sign({ user: req.uesr }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.status(200).json({
        message: "Logged in successfully with google",
        token,
    })
});

// Logout user
// /auth/logout

router.get('/logout', (req, res) => {
    req.logout();
    res.status(200).json({
        messae: "You are logged out "
    });
});

router.post('/register', asyncHandler(async(req, res) => {
    const body = req.body;
    const isUser = await User.findOne({ name: body.name });

    if (!isUser) {
        const user = new User(body);
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
        return user.save().then((doc) => res.status(201).send(doc));
    }
    return res.status(400).json({ message: "account already exists" });

}));
router.post('/login', asyncHandler(async(req, res, next) => {
    passport.authenticate(
        'login',
        async(err, user, info) => {
            try {
                if (err || !user) {
                    return res.status(400).json({ error: 'Invalid input' });
                }
                req.login(
                    user,
                    async(error) => {
                        if (error) return next(error);
                        console.log(user);
                        const body = { _id: user._id, name: user.name, role: user.role };
                        const token = jwt.sign({ user: body }, process.env.JWT_SECRET, { expiresIn: '1d' });

                        return res.status(200).json({ role: user.role, token });
                    }
                );
            } catch (error) {
                return next(error);
            }
        }
    )(req, res, next);
}));

module.exports = router;