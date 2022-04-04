const express = require('express');
const router = express.Router();
const { ensureAuth } = require('../middleware/auth');
const { getDocumentsUser, changeStatus } = require('../controllers/usercontroller');



router.get('/', getDocumentsUser);
router.patch('/', changeStatus);

module.exports = router;