const express = require("express");
const UserController = require("../controllers/user");
const router = express.Router();

router.post("/signup", UserController.createUser);

router.post("/login", UserController.userLogin);

router.post("/fbLogin", UserController.fbLogin);

module.exports = router;
