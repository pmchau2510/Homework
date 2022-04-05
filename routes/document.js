const express = require('express')
const router = express.Router()
const { isAdmin, authenticationMiddleware } = require('../middleware/auth');
const { getAllDocs, getAllUsers, createDoc, updateDoc, deleteDoc, uploadFile, assignUsers } = require('../controllers/doccontroller');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./public/uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    }
});

const uploadStorage = multer({ storage: storage })
const singleFile = uploadStorage.single("file");
router.get('/', authenticationMiddleware, isAdmin, getAllDocs);
router.get('/', authenticationMiddleware, isAdmin, getAllUsers);
router.post('/upload', authenticationMiddleware, isAdmin, singleFile, uploadFile)
router.post('/', authenticationMiddleware, isAdmin, createDoc);
router.post('/:id/assign', authenticationMiddleware, isAdmin, assignUsers);
router.patch('/:id', authenticationMiddleware, isAdmin, updateDoc);
router.delete('/:id', authenticationMiddleware, isAdmin, deleteDoc);

module.exports = router;