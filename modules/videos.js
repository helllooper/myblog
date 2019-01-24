var mongoose = require("mongoose");


var videosSchema = new mongoose.Schema({
    title: String,
    body:String,
    poster:String,
    url:String,
    videoId:String,
    date:{type: Date, default: Date.now},
});

module.exports = mongoose.model("Video", videosSchema);