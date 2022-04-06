const passport = require('passport');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const asyncHandler = require('express-async-handler');
const googleOAuth = require('../utils/googleOAuth');
const jwt = require('jsonwebtoken');

const creatUserGoogle = asyncHandler(async(req, res) => {
    const idToken = req.body.idToken;
    const profile = await googleOAuth.getProfileInfo(idToken);
    const user = await User.findOne({ socialId: profile.sub });
    if (!user) {
        const body = {
            socialId: profile.sub,
            name: profile.displayName,
            avatar: profile.photos[0].value,
        };
        user = await User.create(body);
    }
    const token = jwt.sign({ user }, process.env.JWT_SECRET, { expiresIn: '1d' });
    const data = {
        socialId: profile.sub,
        name: profile.name,
        avatar: profile.photos[0].value,
        token,
    };
    res.status(200).json({ data });

});

const logoutUser = asyncHandler((req, res) => {
    req.logout();
    res.status(200).json({
        messae: "You are logged out "
    });
});

const registerAdmin = asyncHandler(async(req, res) => {
    const body = req.body;
    const isUser = await User.findOne({ name: body.name });

    if (!isUser) {
        const user = new User(body);
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
        return user.save().then((doc) => res.status(201).send(doc));
    }
    return res.status(400).json({ message: "account already exists" });
});


const loginAdmin = asyncHandler(async(req, res, next) => {
    passport.authenticate(
        'login',
        async(err, user, info) => {
            try {
                if (err || !user) {
                    return res.status(400).json({ error: 'Invalid input' });
                }
                req.login(
                    user,
                    async(error) => {
                        if (error) return next(error);
                        console.log(user);
                        const body = { _id: user._id, name: user.name, role: user.role };
                        const token = jwt.sign({ user: body }, process.env.JWT_SECRET, { expiresIn: '1d' });

                        return res.status(200).json({ body, token });
                    }
                );
            } catch (error) {
                return next(error);
            }
        }
    )(req, res, next);
});
module.exports = {
    creatUserGoogle,
    logoutUser,
    registerAdmin,
    loginAdmin,
}