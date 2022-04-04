const Confirm = require('../models/Confirm');
const asyncHandler = require('express-async-handler');
const getDocumentsUser = asyncHandler(async(req, res) => {
    // console.log(req.user);
    const pageSize = 12;
    const page = Number(req.query.pageNumber) || 1;
    const sort = req.query.sort || '-createdAt';

    const count = await Confirm.countDocuments({});
    const confirms = await Confirm.find({ user: req.user._id })
        .limit(pageSize)
        .skip(pageSize * (page - 1))
        .sort(sort)
        .populate('document')
        // console.log(confirms);
    res.status(200).json({ confirms, page, pages: Math.ceil(count / pageSize), count });
});

const changeStatus = asyncHandler(async(req, res) => {
    const { user: userId, document: docId, status } = req.params;
    // console.log(statusUser);
    if (status == 'Reading') {
        const statusUser = await Confirm.findOneAndUpdate({ user: userId, document: docId }, status, {
            new: true,
            runValidators: true,
        });
        res.status(200).json({ statusUser });
    } else if (status == 'Completed') {
        const statusUser = await Confirm.findOneAndUpdate({ user: userId, document: docId }, status, {
            new: true,
            runValidators: true,
        });
        res.status(200).json({ statusUser });
    }

});

module.exports = {
    getDocumentsUser,
    changeStatus,
}