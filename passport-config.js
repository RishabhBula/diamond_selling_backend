const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(
  'google-signup',
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: process.env.CALLBACK_URL,
    },
    (accessToken, refreshToken, profile, done) => {
    
      return done(null, profile);
    }
  )
);

