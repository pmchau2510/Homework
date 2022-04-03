const express = require('express')
const router = express.Router()
const { ensureAuth, ensureGuest, isAdmin } = require('../middleware/auth');

router.get('/login', ensureGuest, (req, res) => {
    res.render('login')
});


router.get('/dashboard', ensureAuth, (req, res) => {
    // console.log(req.user);
    res.status(202).json({
        message: "Dashboard",
        user: req.user
    });
});

router.get('/admindashboard', isAdmin, (req, res) => {
    res.status(202).json({
        message: "pass",
    });
});
module.exports = router;