const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

exports.createUser = (req, res, next) => {
  bcryptjs.hash(req.body.password, 10)
    .then(hash => {
      const user = new User({
        email: req.body.email,
        password: hash
      });
      user.save()
        .then(result => {
          res.status(201).json({
            message: "User created",
            result: result
          });
        })
        .catch(err => {
          res.status(500).json({
            message: "Invalid authentication credentials!"
          });
        });
    });
}

exports.userLogin = (req, res, next) => {
  let fetchedUser;
  User.findOne({email: req.body.email }).then(user => {
    if(!user) {
      return res.status(401).json({
        message: "auth failed"
      });
    }
    fetchedUser = user;
    return bcryptjs.compare(req.body.password, user.password)
  })
  .then(result => {
    if(!result) {
      return res.status(401).json({
        message: "auth failed"
      });
    }
    const token = jwt.sign(
      {email: fetchedUser.email, userId: fetchedUser._id},
      process.env.JWT_KEY,
      { expiresIn: "1h" }
    );
    res.status(200).json({
      token: token,
      expiresIn: 3600,
      userId: fetchedUser._id
    });
  })
  .catch(err => {
    return res.status(401).json({
      message: "Invalid authentication credentials!"
    });
  })
}

exports.fbLogin = (req, res, next) => {
  let fetchedUser;
  User.findOne({email: req.body.email }).then(user => {
    if(!user) {
      const userId = req.body.id;
      const token = jwt.sign(
        { email: req.body.email, userId: userId },
        process.env.JWT_KEY,
        { expiresIn: "1h" }
      );
      res.status(200).json({
        token: token,
        expiresIn: 3600,
        userId: userId
      });
    }
    fetchedUser = user;
    const token = jwt.sign(
      {email: fetchedUser.email, userId: fetchedUser._id},
      process.env.JWT_KEY,
      { expiresIn: "1h" }
    );
    res.status(200).json({
      token: token,
      expiresIn: 3600,
      userId: fetchedUser._id
    });
  })
  .catch(err => {
    return res.status(401).json({
      message: "Something went wrong!"
    });
  })

}
