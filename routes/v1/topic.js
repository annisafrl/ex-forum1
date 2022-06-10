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
            const decodeToken = req.decode;
            const topic = await Topic.findById(req.params.id)
            if (!topic.likes.includes(decodeToken.userid)) {
                await topicModel.findOneAndUpdate({ $push: { likes: decodeToken.userid } })
                res.status(200).json({
                    success: true,
                    message: "topic has been liked"
                })
            } else {
                res.status(403).json({
                    success: false,
                    message: "topic already liked by this user before!"
                })
            }
        

    } catch (error) {
        next(error)
    }
})

router.post("/:id/unlikeTopic", async function (req, res, next) {
    try {
        const decodeToken = req.decode;
        const topic = await Topic.findById(req.params.id)
        if (topic.likes.includes(decodeToken.userid)) {
            await topicModel.findOneAndUpdate({_id: req.params.id},{ $pull: { likes: decodeToken.userid } })
            res.status(200).json({
                success: true,
                message: "topic has been unliked"
            })
        } else {
            res.status(403).json({
                success: false,
                message: "topic already unliked before!"
            })
        }
    

} catch (error) {
    next(error)
}
})

router.post("/:id/commentTopic", async function (req, res, next) {

    try {
            const {textComment} = req.body
            const decodeToken = req.decode;
            const topic = await Topic.findById(req.params.id)
            if (!topic.comment.includes(decodeToken.userid)) {
                await topicModel.findByIdAndUpdate(req.params.id, { $push: {comment: { postedBy: decodeToken.userid , textComment}}})
                res.status(200).json({
                    success: true,
                    message: "topic has been comment"
                })
            } else {
                res.status(403).json({
                    success: false,
                    message: "failed to comment!"
                })
            }
        

    } catch (error) {
        next(error)
    }
})

router.post("/:idTopic/:idComment/uncommentTopic", async function (req, res, next) {

    try {
        const decodeToken = req.decode;
        const topic = await Topic.findById(req.params.idTopic)
        const currentComment = topic.comment.find(obj => obj._id === req.params.idComment);

        if(!currentComment) {
            res.status(404).json({
                success: false,
                message: "comment is not found!"
            })
            return;
        }
        if (currentComment.postedBy === decodeToken.userid) {
            await topicModel.findOneAndUpdate({ _id: req.params.idTopic,$pull: {comment: { _id: req.params.idComment }}})
            res.status(200).json({
                success: true,
                message: "topic has been uncomment"
            })
        } else {
            res.status(403).json({
                success: false,
                message: "failed to uncomment!"
            })
        }
    

} catch (error) {
    next(error)
}
})

router.put("/updateTopic", async function (req, res, next) {
    try {
        const {
            topicTitle,
            bodyOfContent
        } = req.body;

        const decodeToken = req.decode;
        await topicModel.findOneAndUpdate({user: decodeToken.userid,topicTitle, bodyOfContent });

        res.status(200).json({
            success: true,
            message: "topic has been update!",
        })

    } catch (error) {
        next(error)
    }
})

router.delete("/deleteTopic", async function (req, res, next) {
    try {

        const decodeToken = req.decode;
        await topicModel.findOneAndDelete({user: decodeToken.userid});

        res.status(200).json({
            success: true,
            message: "topic has been delete!",
        })

    } catch (error) {
        next(error)
    }
})

module.exports = router;