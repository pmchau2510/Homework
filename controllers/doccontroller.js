const Document = require('../models/Document');
const Confirm = require('../models/Confirm');
const User = require('../models/User');
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
    res.status(200).json({ docs, page, pages: Math.ceil(count / pageSize), count });
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
    const body = {
        title: req.body.title,
        description: req.body.description,
        url: req.body.url,
        postedBy: req.user._id,
    }
    const docs = await Document.create(body);
    res.status(200).json({ docs });
});

const updateDoc = asyncHandler(async(req, res) => {
    const { id: docId } = req.params;
    const doc = await Document.findOneAndUpdate({ _id: docId }, req.body, {
        new: true,
        runValidators: true,
    });
    if (!doc) {
        return res.status(400).json({
            messagee: 'No doc with id'
        });

    }
    res.status(200).json({ doc });
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

const uploadFile = asyncHandler((req, res) => {
    // console.log(req.file)
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
        res.status(400).json({ error: 'Document not found' })
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