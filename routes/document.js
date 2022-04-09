const express = require('express')
const router = express.Router()
const { isAdmin, authenticationMiddleware } = require('../middlewares/auth');
const {
    getAllDocs,
    getDoc,
    getAllUsers,
    createDoc,
    updateDoc,
    deleteDoc,
    assignUsers,
    trashGetAllDocs,
    restoreDoc,
} = require('../controllers/doccontroller');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./public/uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    }
});

const uploadStorage = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        // console.log(file.originalname)
        const dot = path.extname(file.originalname);
        if (dot !== ".pdf" && dot !== ".doc" && dot !== ".docx") {
            return cb(null, false, new Error('Just pdf, doc, docx'));
        }
        cb(null, true);
    }
});
const singleFile = uploadStorage.single("file");
router.route('/').get(authenticationMiddleware, isAdmin, getAllDocs)
    .post(authenticationMiddleware, isAdmin, singleFile, createDoc);
router.route('/trashDocs').get(authenticationMiddleware, isAdmin, trashGetAllDocs);
router.route('/:id/restore').patch(authenticationMiddleware, isAdmin, restoreDoc);
router.route('/:id').get(authenticationMiddleware, isAdmin, getDoc)
    .patch(authenticationMiddleware, isAdmin, singleFile, updateDoc)
    .delete(authenticationMiddleware, isAdmin, deleteDoc);
router.get('/confirm/:id', authenticationMiddleware, isAdmin, getAllUsers);
router.post('/:id/assign', authenticationMiddleware, isAdmin, assignUsers);

module.exports = router;