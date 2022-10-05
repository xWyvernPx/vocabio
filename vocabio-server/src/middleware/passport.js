const passport = require("passport");
const { Strategy } = require("passport-google-oauth20");
const accountModel = require("../model/account.model");

passport.use(
  new Strategy(
    {
      clientID:
        "258019772843-b1p96cka8hvdsmva4e8dehde2h8rtof5.apps.googleusercontent.com",
      clientSecret: "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",
      callbackURL: "http://localhost:5551/oauth/google/callback",
    },
    (accessToken, refreshToken, profile, done) => {
      accountModel
        .findOne(
          {
            email: profile.emails[0].value,
          },
          {}
        )
        .then((account) => {
          if (account) {
            done(null, account);
          } else {
            accountModel
              .create({
                username: profile.id,
                email: profile.emails[0].value,
                name: profile.displayName,
                avatar: profile.photos[0].value,
                auth: {
                  google: {
                    id: profile.id,
                  },
                },
              })
              .then((account) => done(null, account));
          }
        });
    }
  )
);

passport.serializeUser((user, done) => {
  console.log("in serialize");
  done(null, user?._id);
});

passport.deserializeUser((user, done) => {
  console.log("in deserialize");
  accountModel
    .findOne({ _id: user })
    .then((account) => {
      console.log(account);
      done(null, account);
    })
    .catch((err) => {
      done(err, null);
    });
});
