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

                const newUser = {
                    googleId: profile.id,
                    name: profile.displayName,
                    image: profile.photos[0].value,
                }

                try {
                    let user = await User.findOne({ googleId: profile.id })

                    if (user) {
                        done(null, user)
                    } else {
                        user = await User.create(newUser)
                        done(null, user)
                    }
                } catch (err) {
                    console.error(err)
                }
            }
        )

    )
    passport.use(new LocalStrategy({ usernameField: 'name' }, async (name, password, done) => {
        try {
            const user = await User.findOne({ name });
            if (user) {
                const validPassword = await bcrypt.compare(password, user.password);
                if (validPassword) {
                    done(null, user);
                } else {
                    done(null, false);
                }
            } else {
                done(null, false);
            }
        } catch (error) {
            console.error(err);
        }
    }));
    passport.serializeUser((user, done) => {
        done(null, user.id)
    })

    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => done(err, user))
    })
}