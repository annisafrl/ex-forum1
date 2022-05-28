const express = require ("express");
const app = express();
const mongoose = require ("mongoose");
const {version} = require("./package.json");

const connectMongoose = "mongodb://127.0.0.1:27017/forumNew"
mongoose.connect(connectMongoose)
.then(res => {
    console.log("database connected.");
}).catch(err => {
    console.log(err);
});

app.use(express.json()); // untuk post body jika tidak ada akan eror req.body

app.get("/", function(req, res,next){
    res.send("forum New API VERSION " + version);
})

//fefine port for backend
const PORT = process.env.PORT || "3000";
app.listen(PORT, () => console.log(`listening on port ${PORT}..`));