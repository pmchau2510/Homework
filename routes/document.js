const express = require('express')
const router = express.Router()
const { isAdmin } = require('../middleware/auth');
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
router.get('/', isAdmin, getAllDocs);
router.get('/', isAdmin, getAllUsers);
router.post('/upload', isAdmin, singleFile, uploadFile)
router.post('/', isAdmin, createDoc);
router.post('/:id/assign', isAdmin, assignUsers);
router.patch('/:id', isAdmin, updateDoc);
router.delete('/:id', isAdmin, deleteDoc);

module.exports = router;