const Document = require('../models/Document');
const Confirm = require('../models/Confirm');
const asyncHandler = require('express-async-handler');
const getAllDocs = asyncHandler(async(req, res) => {
    const pageSize = 12;
    const page = Number(req.query.pageNumber) || 1;
    const sort = req.query.sort || '-createdAt';

    const count = await Document.countDocuments({});
    const docs = await Document.find({})
        .limit(pageSize)
        .skip(pageSize * (page - 1))
        .sort(sort)

    res.json({ docs, page, pages: Math.ceil(count / pageSize), count });
});

const getAllUsers = asyncHandler(async(req, res) => {

});

const createDoc = asyncHandler(async(req, res) => {
    const data = {
        title: req.body.title,
        description: req.body.description,
        url: req.body.url,
        postedBy: req.user._id,
    }
    const docs = await Document.create(data);
    res.status(202).json({ docs });
});

const updateDoc = asyncHandler(async(req, res) => {
    const { id: docId } = req.params;
    const doc = await Document.findOneAndUpdate({ _id: docId }, req.body, {
        new: true,
        runValidators: true,
    });
    if (!doc) {
        return res.status(404).json({
            messagee: 'No doc with id'
        });

    }
    res.status(200).json({ doc });
});

const deleteDoc = asyncHandler(async(req, res) => {
    const { id: docId } = req.params;
    const doc = await Document.findOneAndDelete({ _id: docId });
    if (!doc) {
        return res.status(404).json({
            messagee: 'No doc with id'
        });

    }
    res.status(200).json({ doc });
});

const uploadFile = asyncHandler((req, res) => {
    console.log(req.file)
    res.status(200).json({ message: "File created successfuly!!" });
});

const assignUsers = asyncHandler(async(req, res) => {
    const { id: docId } = req.params;
    const doc = await Document.findOne({ _id: docId });
    if (doc) {
        const [...users] = req.body.userIds;
        users.forEach(function(user) {
            user.doc = req.params.id
        });
        const confirms = await Confirm.insertMany(users);
        res.json(confirms);
    } else {
        res.status(404).json({ error: 'Document not found' })
    }

});

module.exports = {
    getAllDocs,
    getAllUsers,
    createDoc,
    updateDoc,
    deleteDoc,
    uploadFile,
    assignUsers,
}