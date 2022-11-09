// const passport = require("passport");
// const Strategy = require("passport-local").Strategy;
const db = require("./config");

module.exports = function (passport, Strategy) {
  // Configure the local strategy for use by Passport.
  //
  // The local strategy require a `verify` function which receives the credentials
  // (`username` and `password`) submitted by the user.  The function must verify
  // that the password is correct and then invoke `cb` with a user object, which
  // will be set at `req.user` in route handlers after authentication.
  passport.use(
    new Strategy(function (username, password, done) {
      db.get(
        "SELECT  * FROM users WHERE username = ?",
        [username],
        (err, user) => {
          console.log(username, "---username");
          if (err) {
            return done(err, console.log("Error selecting user on login."));
          }
          if (!user) {
            return done(null, false, console.log("no matching user"));
          }
          if (user.password !== password) {
            return done(null, false, console.log("no matching password"));
          }
          return done(null, user, console.log("Found User"));
        }
      );
    })
  );

  // Configure Passport authenticated session persistence.
  //
  // In order to restore authentication state across HTTP requests, Passport needs
  // to serialize users into and deserialize users out of the session.  The
  // typical implementation of this is as simple as supplying the user ID when
  // serializing, and querying the user record by ID from the database when
  // deserializing.
  passport.serializeUser(function (user, done) {
    console.log("Serializing...", user.username);
    done(null, user.id);
  });

  passport.deserializeUser(function (id, done) {
    db.get(`SELECT * FROM users WHERE id=${id}`, (err, user) => {
      if (err) {
        console.log(
          "Error when selecting user on session deserialize",
          err.message
        );
        return done(err);
      }
      console.log("deserializing...", user.username);
      done(err, user);
    });
  });
};
