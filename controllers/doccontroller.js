const Document = require('../models/Document');
const Confirm = require('../models/Confirm');
const User = require('../models/User');
const asyncHandler = require('express-async-handler');
const deleteFile = require('../utils/deleteFile');
const getAllDocs = asyncHandler(async(req, res) => {
    const pageSize = 12;
    const page = Number(req.query.pageNumber) || 1;
    const sort = req.query.sort || '-createdAt';

    const count = await Document.countDocuments({});
    const docs = await Document.find({})
        .limit(pageSize)
        .skip(pageSize * (page - 1))
        .sort(sort)
    if (!docs) return res.status(400).json({ message: "There are no documents" });
    // console.log(docs)
    res.status(200).json({ docs, page, pages: Math.ceil(count / pageSize), count });
});

const trashGetAllDocs = asyncHandler(async(req, res) => {
    const pageSize = 12;
    const page = Number(req.query.pageNumber) || 1;
    const sort = req.query.sort || '-createdAt';

    const count = await Document.countDocuments({});
    const docs = await Document.findDeleted({})
        .limit(pageSize)
        .skip(pageSize * (page - 1))
        .sort(sort)
    if (!docs) return res.status(400).json({ message: "There are no documents" });
    // console.log(docs)
    res.status(200).json({ docs, page, pages: Math.ceil(count / pageSize), count });
});

const restoreDoc = asyncHandler(async(req, res) => {

    await Document.restore({ _id: req.params.id });
    await Confirm.restore({ docId: req.params.id });
    res.status(200).json("restore successfully");
});



const getDoc = asyncHandler(async(req, res) => {
    const doc = await Document.findById(req.params.id);
    res.status(200).json({ doc });
});

const getAllUsers = asyncHandler(async(req, res) => {
    const document = await Document.findById(req.params.id);
    const userConfirms = [];
    let query = { role: { $ne: 9 } };

    if (document) {
        const confirms = await Confirm.find({ docId: req.params.id });
        // console.log(confirms);
        if (confirms) {
            confirms.map((c) => (userConfirms.push(c.userId)));
            // console.log(userConfirms);
            query = { _id: { $nin: userConfirms }, role: { $ne: 9 } };
        }

        const users = await User.find(query);

        res.status(200).json(users);
    } else {
        res.status(400).json({ error: 'Document not found' });
    }
});

const createDoc = asyncHandler(async(req, res) => {
    // console.log(req.file);
    if (!req.file) {
        return res.status(400).json({ message: "Invalid file, accepted file (pdf, .doc, .docx)" })
    }
    if (!req.body.title) {
        let fileName = req.file.filename;
        //14 is cut string of type Date()
        req.body.title = fileName.slice(14, fileName.length);
    }
    const body = new Document({
        ...req.body,
        url: `/uploads/${req.file.filename}`,
        postedBy: req.user._id,
    });
    const docs = await Document.create(body);
    res.status(200).json({ docs });
});

const updateDoc = asyncHandler(async(req, res) => {
    const { id: docId } = req.params;
    const document = await Document.findById({ _id: docId });
    let doc;

    if (document) {
        if (!req.file) {
            doc = await Document.findOneAndUpdate({ _id: docId }, {...req.body }, {
                new: true,
                runValidators: true,
            });
        } else {
            deleteFile(`.\\public\\${document.url}`);
            doc = await Confirm.updateMany({ docId: docId }, { status: 'Open' });
        }
    } else {
        return res.status(400).json({
            messagee: 'No doc with id'
        });

    }
    return res.status(200).json({ doc });

});

const deleteDoc = asyncHandler(async(req, res) => {
    const { id: docId } = req.params;
    const doc = await Document.delete({ _id: docId });
    await Confirm.delete({ docId });
    if (!doc) {
        return res.status(400).json({
            messagee: 'No doc with id'
        });

    }
    res.status(200).json({ doc });
});



const assignUsers = asyncHandler(async(req, res) => {
    const { id: docId } = req.params;
    const userIds = req.body;
    // console.log(docId);
    // console.log(req.body);

    const doc = await Document.findById({ _id: docId });
    // console.log(doc);
    if (doc) {
        const userAssign = [];
        const newUserConfirm = [];
        const oldConfirms = await Confirm.find({ docId });
        const [...newUsers] = userIds;
        console.log(newUsers);
        if (oldConfirms) {
            oldConfirms.map(e => userAssign.push(e.userId.toString()));
        }
        newUsers.forEach(e => {
            if (!userAssign.includes(e)) {
                newUserConfirm.push({
                    "userId": e,
                    "docId": docId
                });
            }
        });
        const confirms = await Confirm.insertMany(newUserConfirm);
        res.status(200).json(confirms);
    } else {
        res.status(400).json({ error: 'Document not found' })
    }

});

module.exports = {
    getAllDocs,
    trashGetAllDocs,
    restoreDoc,
    getDoc,
    getAllUsers,
    createDoc,
    updateDoc,
    deleteDoc,
    assignUsers,
}