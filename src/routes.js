const path = require("path");

module.exports = function (app, passport, db) {
  // Define routes.
  app.get("/", function (req, res) {
    // res.render("index.html", { user: req.user });
    res.sendFile(path.join(__dirname, "../public/index.html"));
  });

  // app.get("/login", function (req, res) {
  //   // res.render("login");
  // });

  // app.post(
  //   "/login",
  //   passport.authenticate("local", { failureRedirect: "/" }),
  //   function (req, res) {
  //     console.log("In post route...", req.user, req.session.passport.user);
  //     return res.send({ user: req.user });
  //   }
  // );
  app.post("/login", function (req, res) {
    let { username, password } = req.body;
    db.get(
      "SELECT  * FROM users WHERE username = ?",
      [username],
      (err, user) => {
        console.log(username, "---username", err);
        if (err) {
          return res.status(400).send({
            err,
            message: "Error selecting user on login."
          });
        }
        if (!user || user.password !== password) {
          return res.status(400).send({
            err: null,
            message: "no matching user or password"
          });
        }
        return res.status(200).send({
          user,
          message: "Found User"
        });
      }
    );
  });
  app.get("/logout", function (req, res) {
    req.logOut();
    return res.send("/");
  });
  app.get("/getAllUser", function (req, res) {
    db.all("SELECT * FROM users", (err, user) => {
      if (err) {
        return done(err, console.log("Error selecting user on login."));
      }
      return res.send({ user });
    });
  });
  app.post("/signup", (req, res) => {
    const {
      username,
      password,
      firstName,
      lastName,
      email,
      contactNumber
    } = req.body;
    try {
      db.run(
        "INSERT  INTO users (username, password, firstName, lastName,email, contactNumber ) VALUES (?, ?, ?, ?, ?, ?)",
        [username, password, firstName, lastName, email, contactNumber],
        (err, user) => {
          if (err) {
            return res.status(400).send({
              err,
              message: "signup..." + err.message
            });
          }

          return res.status(200).send({
            user,
            message: `A row has been inserted with rowid ${this.lastID}` // get the last insert id
          });
        }
      );
    } catch (e) {
      console.log(e, "---error signup");
    }
  });

  app.put("/editProfile", (req, res) => {
    const {
      username,
      password,
      firstName,
      lastName,
      email,
      contactNumber,
      avatar
    } = req.body;
    db.run(
      `UPDATE users 
      SET password = ?,
      firstName = ?,
      lastName = ?,
      email = ?,
      contactNumber=?,
      avatar = ?
      WHERE username = ?`,
      [password, firstName, lastName, email, contactNumber, avatar, username],
      (err) => {
        if (err) {
          return console.log("editProfile...", err.message);
        }
        // get the last insert id
        console.log(`A row has been inserted with rowid ${this.lastID}`);
      }
    );
  });

  app.get("/getProfile/:userName", (req, res) => {
    console.log(req.params, "---req.params");
    db.get(
      `SELECT * FROM users
       WHERE username = ?`,
      [req.params.userName],
      (err, user) => {
        console.log(user, err);
        if (err) {
          return done(err, console.log("Error selecting user on login."));
        }
        return res.send({ user });
      }
    );
  });
  app.get("/checkUserNameExist/:userName", (req, res) => {
    db.get(
      `SELECT COUNT(*) FROM users
       WHERE username = ?`,
      [req.params.userName],
      (err, user) => {
        console.log(user, "-----shfgashf", err);
        if (err) {
          return res.status(400).send({
            message: "có lỗi gì ĐÓ AAAAA"
          });
        }
        if (!user["COUNT(*)"]) {
          return res.status(200).send({
            isExist: false,
            message: "no matching user"
          });
        }
        return res.status(200).send({
          isExist: true,
          message: "Found User"
        });
      }
    );
  });
  app.get(
    "/profile",
    require("connect-ensure-login").ensureLoggedIn(),
    function (req, res) {
      console.log("In profile route", req.user);
      return res.send({ user: req.user });
    }
  );
};
