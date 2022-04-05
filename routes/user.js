const express = require('express');
const router = express.Router();
const { authenticationMiddleware } = require('../middleware/auth');
const { getDocumentsUser, changeStatus } = require('../controllers/usercontroller');



router.get('/', authenticationMiddleware, getDocumentsUser);
router.patch('/', authenticationMiddleware, changeStatus);

module.exports = router;