const Confirm = require('../models/Confirm');
const asyncHandler = require('express-async-handler');
const getDocumentsUser = asyncHandler(async(req, res) => {
    // console.log(req.user);
    const pageSize = 12;
    const page = Number(req.query.pageNumber) || 1;
    const sort = req.query.sort || '-createdAt';
    // console.log(sort);
    const count = await Confirm.countDocuments({});
    const confirms = await Confirm.find({ userId: req.user._id })
        .limit(pageSize)
        .skip(pageSize * (page - 1))
        .sort(sort)
        .populate('docId')
        // console.log(confirms);
    let docConfirms = [];

    confirms.map((c) => (docConfirms.push({
        _id: c.docId._id,
        title: c.docId.title,
        url: c.docId.url,
        createdAt: c.createdAt,
        status: c.status
    })));
    res.status(200).json({ docConfirms, page, pages: Math.ceil(count / pageSize), count });
});
const changeReadingStatus = asyncHandler(async(req, res) => {
    const { id: docId } = req.params;
    const userId = req.user._id;

    const confirm = await Confirm.findOne({ userId: userId, docId }).populate('docId');

    if (confirm) {
        if (confirm.docId.url.includes('.doc')) {
            const statusUser = await Confirm.findOneAndUpdate({ userId, docId }, { status: "Completed" }, {
                new: true,
                runValidators: true,
            });
            return res.status(200).json({ statusUser });
        }
        if (confirm.status == 'Open') {
            const statusUser = await Confirm.findOneAndUpdate({ userId, docId }, { status: "Reading" }, {
                new: true,
                runValidators: true,
            });
            res.status(200).json({ statusUser });
        } else if (confirm.status === "Completed") {
            res.status(400).json({ message: "state cannot be changed" });
        }

    } else {
        res.status(400).json({ message: "Not found" });
    }

});

const changeCompletedStatus = asyncHandler(async(req, res) => {
    const { id: docId } = req.params;
    const userId = req.user._id;

    const confirm = await Confirm.findOne({ userId: userId, docId }).populate('docId');

    if (confirm) {

        if (confirm.status === 'Reading') {
            const statusUser = await Confirm.findOneAndUpdate({ userId, docId }, { status: "Completed" }, {
                new: true,
                runValidators: true,
            });
            res.status(200).json({ statusUser });
        } else {
            res.status(400).json({ status: confirm.status });
        }

    } else {
        res.status(400).json({ message: "Not found" });
    }

});

module.exports = {
    getDocumentsUser,
    changeReadingStatus,
    changeCompletedStatus
}