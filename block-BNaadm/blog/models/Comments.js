let mongoose = require('mongoose')
let Schema = mongoose.Schema

let commentsSchema = new Schema({
    content: {type:String, required:true},
    articleId: {type: Schema.Types.ObjectId, required:true ,ref: 'Article'},
    likes: {type: Number, default: 0},
    author: String,
},{timestamps: true})

module.exports = mongoose.model('Comments',commentsSchema)