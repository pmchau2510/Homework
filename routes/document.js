const express = require('express')
const router = express.Router()
const { isAdmin } = require('../middleware/auth');
const Document = require('../models/Document')
const { getAllDoc, createDoc, updateDoc, deleteDoc } = require('../controllers/doccontroller');
router.get('/documents', isAdmin, getAllDoc);

router.post('/documents', isAdmin, createDoc);
router.patch('/documents', isAdmin, updateDoc);
router.delete('/documents', isAdmin, deleteDoc);
module.exports = router;