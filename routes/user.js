//[Dependencies and Modules]
const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.js");
const { verify, verifyAdmin, isLoggedIn } = require("../auth.js");

router.post("/register", userController.registerUser);

router.post("/login", userController.loginUser);

module.exports = router;

