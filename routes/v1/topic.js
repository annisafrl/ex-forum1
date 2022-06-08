const express = require("express");
const userModel = require("../../models/userModel");
const topicModel = require("../../models/topicModel");
const router = express.Router();
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');
const { hash } = require("bcrypt");
const { decode } = require("jsonwebtoken");
require('dotenv').config();
const Topic = require("../../models/topicModel");
const { sign } = require("jsonwebtoken");

router.post("/createTopic", async function (req, res, next) {
    try {
        const {
            topicTitle,
            bodyOfContent
        } = req.body;

        const decodeToken = req.decode;
        console.log(JSON.stringify({ decodeToken }));
        await topicModel.create({ user: decodeToken.userid, topicTitle, bodyOfContent });

        res.status(200).json({
            success: true,
            message: "topic created!",
        })

    } catch (error) {
        next(error)
    }
})

router.get("/", async function (req, res, next) {
    try {
        const getTopic = await topicModel.find().populate("user");

        res.status(200).json({
            success: true,
            data: getTopic,
            message: "data has been retrieved successfully!"
        })
    } catch (error) {
        next(error)
    }
})

router.post("/:id/likeTopic", async function (req, res, next) {
    try {
        const {
            token
        } = req.body;

        if (token) {
            const decodeToken = jwt.verify(token, process.env.JWT_SECRET);
            const topic = await Topic.findById(req.params.id)
            if (!topic.likes.includes(decodeToken.userid)) {
                await topicModel.findOneAndUpdate({ $push: { likes: decodeToken.userid } })
                res.status(200).json("topic has been liked")
            } else {
                res.status(403).json({
                    success: false,
                    message: "topic already liked by this user before!"
                })
            }
        }

    } catch (error) {
        next(error)
    }
})

router.post("/:id/unlikeTopic", async function (req, res, next) {
    try {
        const user = await Topic.findByIdAndUpdate(req.params.id)
        if (user.likes.includes(req.body.id)) {
            await topicModel.findOneAndUpdate({ $pull: { likes: req.body.id } })
            res.status(200).json("topic has been unliked")
        }

    } catch (error) {
        next(error)
    }
})

module.exports = router;