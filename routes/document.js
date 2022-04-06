const express = require('express')
const router = express.Router()
const { isAdmin, authenticationMiddleware } = require('../middleware/auth');
const { getAllDocs, getDoc, getAllUsers, createDoc, updateDoc, deleteDoc, assignUsers } = require('../controllers/doccontroller');
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
router.route('/').get(authenticationMiddleware, isAdmin, getAllDocs)
    .post(authenticationMiddleware, isAdmin, singleFile, createDoc);
router.route('/:id').get(authenticationMiddleware, isAdmin, getDoc)
    .patch(authenticationMiddleware, isAdmin, singleFile, updateDoc)
    .delete(authenticationMiddleware, isAdmin, deleteDoc);
router.get('/confirm/:id', authenticationMiddleware, isAdmin, getAllUsers);
router.post('/:id/assign', authenticationMiddleware, isAdmin, assignUsers);

module.exports = router;