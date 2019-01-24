var mongoose = require("mongoose");

var commentSchema = new mongoose.Schema({
    user:String,
    text:String
});

var articlesSchema = new mongoose.Schema({
    title: String,
    body:String,
    image: String,
    imageId:String,
    date:{type: Date, default: Date.now},
    comments:[commentSchema]
});

module.exports = mongoose.model("Article", articlesSchema);