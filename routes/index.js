const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
    res.render('page')
});


// router.get('/dashboard', authenticationMiddleware, (req, res) => {
//     // console.log(req.user);
//     res.status(202).json({
//         message: "Dashboard",
//         user: req.user
//     });
// });

// router.get('/admindashboard', isAdmin, (req, res) => {
//     res.status(202).json({
//         message: "pass",
//     });
// });
module.exports = router;