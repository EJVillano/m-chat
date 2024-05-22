const express = require("express");
const router = express.Router();
const { sendMessage } = require("../controllers/message.js");
const { protectRoute } = require("../auth.js")


router.post("/send/:id", protectRoute, sendMessage);


module.exports = router;