const express = require('express');
const router = express.Router();
const {
    creatUserGoogle,
    // registerAdmin,
    loginAdmin,
} = require('../controllers/authcontroller');
/* NOTE: Completing informations automaticaly obtaineds */
router.post('/google', creatUserGoogle);
// router.post('/admin/register', registerAdmin);


/* NOTE: Completing informations automaticaly obtaineds */
router.post('/admin/login', loginAdmin);

module.exports = router;