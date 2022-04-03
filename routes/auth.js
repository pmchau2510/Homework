const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const { ensureGuest } = require('../middleware/auth');

//@desc Auth with Google
//@route GET /auth/google

router.get('/google', passport.authenticate('google', { scope: ['profile'] }));


//@desc Googlee auth callback
//@route GET /auth/google/callback
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/' }), (req, res) => {
    res.status(200).json({
        message: "Logged in successfully with google"
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


router.post('/admin/login', ensureGuest, async (req, res, next) => {
    const name = req.body.name;
    const pass = req.body.password;
    const user = await User.findOne({ name });
    const validPassword = await bcrypt.compare(pass, user.password);
    if (name === 'admin' && validPassword) {
        passport.authenticate('local', {
            successRedirect: '/admindashboard',
        })(req, res, next);
    } else {
        res.status(404).json({ error: "Invalid username or password" })
    }
});

module.exports = router;