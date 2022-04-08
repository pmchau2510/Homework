const express = require('express');
const router = express.Router();
const { authenticationMiddleware, isUser } = require('../middleware/auth');
const { getDocumentsUser, changeReadingStatus, changeCompletedStatus } = require('../controllers/usercontroller');



router.get('/documents', authenticationMiddleware, isUser, getDocumentsUser);
router.get('/:id/changeReadingStatus', authenticationMiddleware, isUser, changeReadingStatus);
router.get('/:id/changeCompletedStatus', authenticationMiddleware, isUser, changeCompletedStatus);

module.exports = router;