const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const mongoose = require("mongoose");
const keys = require("../config/keys");

const User = mongoose.model("users");

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then((user) => {
    done(null, user);
  });
});

passport.use(
  new GoogleStrategy(
    {
      clientID: keys.googleClientID,
      clientSecret: keys.googleClientSecret,
      callbackURL: "/auth/google/callback",
      proxy: true,
    },
    async (accessToken, refreshToken, profile, done) => {
      // Check if user already exists in our database
      const existingUser = await User.findOne({ googleId: profile.id });

      if (existingUser) {
        // If user exists, return the user
        return done(null, existingUser);
      } else {
        // If user does not exist, create a new user and save to database
        const user = await new User({ googleId: profile.id }).save();
        done(null, user);
      }
    },
  ),
);
