const express = require("express");
const router = express.Router();
const authRoutes = require("./auth");
const topicRoutes = require("./topic");

router.use("/auth", authRoutes)
router.use("/topic", topicRoutes)

module.exports = router