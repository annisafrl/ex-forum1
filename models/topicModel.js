const mongoose = require("mongoose");
const schema = mongoose.schema

const TopicSchema = new mongoose.Schema({
    username: {
        type: String,
        require: true,
    },
    email: {
        type: String,
        require: true,
    },
    password: {
        type: String,
        require: true,
    },
    topicTitle: {
        type: String,
        require: true,
    },
    bodyOfContent: {
        type: String,
        require: true,
    },
    createdByUser: {
        type: String,
        require: true,
    },
    likes: {
        type: Array,
        require: true,
    }

}, {
    timestamps: true
})

const topicModel = mongoose.model("topic", TopicSchema)

module.exports = topicModel