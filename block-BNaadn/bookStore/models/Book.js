let mongoose = require('mongoose')
let Schema = mongoose.Schema

let bookSchema = new Schema({
    title : String,
    summary : String,
    pages : Number,
    publication : String,
    cover_image : String,
    // category
    category: [String],
    // author-details
    name : String,
    email: String,
    city : String,
},{timestamps: true})


module.exports =  mongoose.model('Book',bookSchema)