const express = require('express');
const router = express.Router();
const {
    creatUserGoogle,
    logoutUser,
    registerAdmin,
    loginAdmin,
} = require('../controllers/authcontroller');

router.post('/google', creatUserGoogle);
// Logout user
// /auth/logout

router.get('/logout', logoutUser);

router.post('/admin/register', registerAdmin);
router.post('/admin/login', loginAdmin);

module.exports = router;