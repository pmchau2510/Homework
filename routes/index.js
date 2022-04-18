const express = require('express');
const router = express.Router();

const authRoutes = require('./auth');
const userRoutes = require('./user');
const documentRoutes = require('./document');

router.use('/auth', authRoutes);
router.use('/admin/documents', documentRoutes);
router.use('/user', userRoutes);

module.exports = router