const passport = require('passport');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const catchAsync = require("../middlewares/async");
const ApiError = require("../utils/ApiError");
const googleOAuth = require('../utils/googleOAuth');
const generateToken = require('../utils/generateToken');

const creatUserGoogle = catchAsync(async (req, res) => {
    const idToken = req.body.data;
    //  console.log(idToken);
    const profile = await googleOAuth.getProfileInfo(idToken);
    // console.log(profile);
    let user = await User.findOne({ socialId: profile.sub });
    // console.log(user);
    if (!user) {
        const body = {
            socialId: profile.sub,
            name: profile.name,
            avatar: profile.picture,
        };
        user = await User.create(body);
    }
    const data = {
        socialId: user.socialId,
        name: user.name,
        avatar: user.avatar,
        role: user.role,
        token: generateToken(user._id),
    };
    res.status(200).json({ data });

});



// const registerAdmin = asyncHandler(async(req, res) => {
//     const body = req.body;
//     const isUser = await User.findOne({ name: body.name });

//     if (!isUser) {
//         const user = new User({
//             ...body,
//             role: 9
//         });
//         const salt = await bcrypt.genSalt(10);
//         user.password = await bcrypt.hash(user.password, salt);
//         return user.save().then((doc) => res.status(201).send(doc));
//     }
//     return res.status(400).json({ message: "account already exists" });
// });


const loginAdmin = catchAsync(async (req, res, next) => {
    passport.authenticate(
        'login',
        async (err, user) => {
            if (err || !user) {
                return res.status(404).json({ message: 'Invalid input' });
            }
            req.login(
                user,
                async (error) => {
                    if (error) return next(error);
                    console.log(user);
                    const body = { _id: user._id, name: user.name, role: user.role };

                    return res.status(200).json({ body, token: generateToken(user._id) });
                }
            );
        }
    )(req, res, next);
});
module.exports = {
    creatUserGoogle,
    // registerAdmin,
    loginAdmin,
}