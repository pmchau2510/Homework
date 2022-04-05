const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
module.exports = (passport) => {
    passport.use(
        new GoogleStrategy({
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: '/auth/google/callback',
        },
            async (accessToken, refreshToken, profile, done) => {
                // console.log(profile);
                // console.log(accessToken);
                const newUser = {
                    socialId: profile.id,
                    name: profile.displayName,
                    avatar: profile.photos[0].value,
                }

                try {
                    let user = await User.findOne({ socialId: profile.id })
                    if (user) {
                        return done(null, user)
                    } else {
                        user = await User.create(newUser)
                        return done(null, user);
                    }
                } catch (err) {
                    console.error(err)
                }
            }
        )

    );
    passport.use(
        'signup',
        new LocalStrategy({
            usernameField: 'name',
            passwordField: 'password'
        },
            async (name, password, done) => {
                try {
                    const user = await User.findOne({ name });
                    if (!(name && password)) {
                        return res.status(400).json({ error: "Data not formatted properly" });
                    }
                    if (!user) {
                        const userr = new User({ name, password });
                        const salt = await bcrypt.genSalt(10);
                        userr.password = await bcrypt.hash(userr.password, salt);
                        userr.save().then((doc) => res.status(201).json(doc));
                        return done(null, userr);
                    }
                    return done(null, false);
                } catch (error) {
                    done(error);
                }
            }
        )
    );
    passport.use('login', new LocalStrategy({ usernameField: 'name', passwordField: 'password' }, async (name, password, done) => {
        try {
            const user = await User.findOne({ name });

            if (!user) {
                return done(null, false);
            }
            const validPassword = await bcrypt.compare(password, user.password);

            if (!validPassword) {
                return done(null, false);
            }
            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }));
    passport.serializeUser((user, done) => {
        done(null, user.id)
    });

    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => done(err, user))
    });
}