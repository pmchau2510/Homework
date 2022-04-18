const express = require('express')
const router = express.Router();

const { isAdmin, authenticationMiddleware } = require('../middlewares/auth');
const {
    getAllDocs,
    getDoc,
    getAllUsers,
    getAllUsersUnassign,
    createDoc,
    updateDoc,
    deleteDoc,
    deleteAll,
    restoreAll,
    assignUsers,
    unassignUsers,
    trashGetAllDocs,
    restoreDoc,
} = require('../controllers/doccontroller');
const multer = require('multer');
const path = require('path');
const maxSize = 10 * 1000 * 1000;
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const uploadStorage = multer({
    storage: storage,
    limits: { fileSize: maxSize },
    fileFilter: (req, file, cb) => {
        const dot = path.extname(file.originalname);
        if (dot !== '.pdf' && dot !== '.doc' && dot !== '.docx') {
            return cb(null, false, new Error('Just pdf, doc, docx'));
        }
        cb(null, true);
    }
});
const singleFile = uploadStorage.single('file');
router.route('/').get(authenticationMiddleware, isAdmin, getAllDocs)
    .post(authenticationMiddleware, isAdmin, singleFile, createDoc);
router.route('/trashDocs').get(authenticationMiddleware, isAdmin, trashGetAllDocs);
router.route('/deleted').delete(authenticationMiddleware, isAdmin, deleteAll);
router.route('/restore').patch(authenticationMiddleware, isAdmin, restoreAll);
router.route('/:id/restore').patch(authenticationMiddleware, isAdmin, restoreDoc);
router.route('/:id').get(authenticationMiddleware, isAdmin, getDoc)
    .patch(authenticationMiddleware, isAdmin, singleFile, updateDoc)
    .delete(authenticationMiddleware, isAdmin, deleteDoc);
router.get('/confirm/:id', authenticationMiddleware, isAdmin, getAllUsers);
router.get('/unconfirmed/:id', authenticationMiddleware, isAdmin, getAllUsersUnassign);
router.post('/:id/assign', authenticationMiddleware, isAdmin, assignUsers);
router.delete('/:id/unassign', authenticationMiddleware, isAdmin, unassignUsers);
module.exports = router;