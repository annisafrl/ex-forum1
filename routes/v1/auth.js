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


router.post("/register", async function(req, res, next) {
    try{
    const {
        username,
        email,
        password,
        name
        } = req.body;
        
        const getSameUsername = await userModel.findOne({username})
        if(getSameUsername) {
            throw new Error("duplicate username");
        }
        const getSameEmail = await userModel.findOne({email})
        if(getSameEmail) {
            throw new Error("duplicate email")
        }

        const hashPassword = bcrypt.hashSync(password, saltRounds)
        await userModel.create({
            username,
            email,
            password : hashPassword,
            name
        });

        res.status(200).json({
            success: true,
            message: "successfully registered!"
        })

    } catch (err) {
        next(err);
    }
})

router.post("/login", async function(req, res, next) {
try{
const{
    email,
    password,
    } = req.body;   

    await userModel.findOne({email})
            .then(dataUser => {
                let passwordMatched = false
                if (dataUser !== null) {
                    passwordMatched = bcrypt.compareSync(password, dataUser.password);
                }
                if (passwordMatched) {
                    const token = jwt.sign({email, password, userid : userModel._id}, process.env.JWT_SECRET, { expiresIn: '1h' })
                    res.status(400).json({
                        message: "login success!",
                        data: {token}
                    })
                } else {
                    res.status(200).json({
                        message: "password or email is not match!!"
                    })
                }
            }).catch(err => console.log(err));
    } catch (error) {
        next(error);
    }
})

router.post("/createTopic", async function(req, res, next) {
    try{
        const {
            token,
            topicTitle,
            bodyOfContent
            } = req.body;

            if (token) {
            const decodeToken= jwt.verify(token, process.env.JWT_SECRET);
            await topicModel.create({decodeToken});
            await topicModel.findOneAndUpdate({topicTitle,bodyOfContent})
    
            res.status(200).json({
                success: true,
                message: "topic created!",
            })
        }
        } catch (error) {
            next(error)
        }
    })

    router.post("/:id/likeTopic", async function (req, res, next) {
        try{
            const {
                token
                } = req.body;

                if (token) {
                    const decodeToken= jwt.verify(token, process.env.JWT_SECRET);
                    const user = await Topic.findByIdAndUpdate(req.params.id)
                if(user.likes.includes(decodeToken.userid)){
                    await topicModel.findOneAndUpdate({ $push: {likes: decodeToken.userid}})
                    res.status(200).json("topic has been liked")
                }
                }
            
        } catch (error) {
            next(error)
        }
    })
    
            

        
    router.post("/:id/unlikeTopic", async function (req, res, next) {
        try{
            const user = await Topic.findByIdAndUpdate(req.params.id)
            if(user.likes.includes(req.body.id)){
                await topicModel.findOneAndUpdate({ $pull: {likes: req.body.id}})
                res.status(200).json("topic has been unliked")
            }
        
    } catch (error) {
        next(error)
    }
})


module.exports = router;