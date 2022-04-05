const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const { ensureGuest } = require('../middleware/auth');
const jwt = require('jsonwebtoken');
//@desc Auth with Google
//@route GET /auth/google

router.get('/google', passport.authenticate('google', { scope: ['profile'] }));


//@desc Googlee auth callback
//@route GET /auth/google/callback



router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/' }), (req, res) => {
    const token = jwt.sign({ user: req.uesr }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.status(200).json({
        message: "Logged in successfully with google",
        token,
    })
});

//@desc Logout user
//@route /auth/logout

router.get('/logout', (req, res) => {
    req.logout();
    res.status(200).json({
        messae: "You are logged out "
    });
});

router.post('/signup', ensureGuest,
    passport.authenticate('signup', { session: false }),
    async(req, res, next) => {
        res.json({
            message: 'Signup successful',
            user: req.user
        });
    }
);
router.post('/login', ensureGuest, async(req, res, next) => {
    passport.authenticate(
        'login',
        async(err, user, info) => {
            try {
                if (err || !user) {
                    return res.status(400).json({ error: 'An error occurred.' });
                }
                req.login(
                    user,
                    async(error) => {
                        if (error) return next(error);

                        const body = { _id: user._id, name: user.name };
                        const token = jwt.sign({ user: body }, process.env.JWT_SECRET, { expiresIn: '1d' });

                        return res.status(200).json({ body, token });
                    }
                );
            } catch (error) {
                return next(error);
            }
        }
    )(req, res, next);
});

module.exports = router;