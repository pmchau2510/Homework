const express = require('express');
const router = express.Router();
const {
    creatUserGoogle,
    // registerAdmin,
    loginAdmin,
} = require('../controllers/authcontroller');

router.post('/google', creatUserGoogle);
// router.post('/admin/register', registerAdmin);
router.post('/admin/login', loginAdmin);

module.exports = router;