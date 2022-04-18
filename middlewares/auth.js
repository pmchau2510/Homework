const jwt = require('jsonwebtoken')
    // const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Confirm = require('../models/Confirm');
const Document = require('../models/Document');
const catchAsync = require('../middlewares/async');
const ApiError = require('../utils/ApiError');

module.exports = {

    isAdmin: (req, res, next) => {
        if (req.isAuthenticated() && req.user.role == 9) {
            return next();
        } else {
            res.status(400).json({ message: 'You do not have access' });
        }
    },
    isUser: (req, res, next) => {
        if (req.user.role == 0) {
            return next();
        } else {
            res.status(400).json({ message: 'You do not have access' });
        }
    },
    authenticationMiddleware: catchAsync(async(req, res, next) => {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new ApiError(404, 'No token provided');
        }
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // console.log(req.user);
        // console.log(decoded.id)  
        req.user = await User.findById(decoded.id).select('-password');
        next();
    }),
    checkRole: catchAsync(async(req, res, next) => {
        // console.log(req.originalUrl);
        let url = req.originalUrl.replace('/api/file', '');
        url = url.replace(/%20/gi, ' ');
        console.log(url);
        if (req.user.role == 9) {
            return next();
        } else {
            const confirms = await Confirm.find({ userId: req.user.id }).populate('docId');
            let docConfirms = [];
            confirms.map((c) => (docConfirms.push({
                url: c.docId.url,
            })));
            // console.log(docConfirms);
            const isCheck = docConfirms.some(e => { return e.url === url });
            // console.log(isCheck);
            if (isCheck) {
                return next();
            } else {
                throw new ApiError(404, 'You do not have access');
            }
        }
    }),
}