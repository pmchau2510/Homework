const Confirm = require('../models/Confirm');
const catchAsync = require('../middlewares/async');
const ApiError = require('../utils/ApiError');

const getDocumentsUser = catchAsync(async(req, res) => {
    // console.log(req.user);
    const pageSize = Number(req.query.pages) || 12;
    const page = Number(req.query.pageNumber) || 1;
    const sort = req.query.sort || '-createdAt';
    // console.log(sort);
    const count = await Confirm.countDocuments({ userId: req.user._id });
    const confirms = await Confirm.find({ userId: req.user._id })
        .limit(pageSize)
        .skip(pageSize * (page - 1))
        .sort(sort)
        .populate('docId')
        // console.log(confirms);
    if (!confirms) throw new ApiError(404, 'Confirmation document not found');
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
const changeReadingStatus = catchAsync(async(req, res) => {
    const { id: docId } = req.params;
    const userId = req.user._id;

    const confirm = await Confirm.findOne({ userId: userId, docId }).populate('docId');
    if (confirm.status === 'C') {
        throw new ApiError(404, 'state cannot be changed');
    }
    if (confirm) {
        if (confirm.docId.url.includes('.doc')) {
            await Confirm.findOneAndUpdate({ userId, docId }, { status: 'C' }, {
                new: true,
                runValidators: true,
            });
            return res.status(200).json({ status: 'C' });
        }
        if (confirm.status === 'Open') {
            await Confirm.findOneAndUpdate({ userId, docId }, { status: 'R' }, {
                new: true,
                runValidators: true,
            });
            return res.status(200).json({ status: 'R' });
        }

    }

});

const changeCompletedStatus = catchAsync(async(req, res) => {
    const { id: docId } = req.params;
    const userId = req.user._id;

    const confirm = await Confirm.findOne({ userId: userId, docId }).populate('docId');

    if (confirm) {

        if (confirm.status === 'R') {
            await Confirm.findOneAndUpdate({ userId, docId }, { status: 'C' }, {
                new: true,
                runValidators: true,
            });
            res.status(200).json({ status: 'C' });
        } else {
            res.status(200).json({ status: confirm.status });
        }

    } else {
        throw new ApiError(404, 'Not Found');
    }

});

module.exports = {
    getDocumentsUser,
    changeReadingStatus,
    changeCompletedStatus
}