
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const keys = require('../config/keys');
const mongoose = require('mongoose');

const User = mongoose.model('users');

/* Take a user instance, return the its database record id as unique token */
passport.serializeUser((user, done) => {
    done(null, user.id);
});

/* Turn user id into a user instance (database) */
passport.deserializeUser((id, done) => {
    User.findById(id)
    .then(user => {
        done(null, user);
    });
});

passport.use(
    new GoogleStrategy(
        {
            clientID: keys.googleClientID,
            clientSecret: keys.googleClientSecret,
            callbackURL: '/auth/google/callback',
            proxy: true
        }, 
        async (accessToken, refreshToken, profile, done) => {
            const existingUser = await User.findOne({ googleId: profile.id });

            // If user exist in database, skip creation
            if (existingUser) {
                return done(null, existingUser);
            } 
            // If noe exist, create a new user instance in database
            const user = await new User({ googleId: profile.id }).save();
            done(null, user);
        }
    )
);

