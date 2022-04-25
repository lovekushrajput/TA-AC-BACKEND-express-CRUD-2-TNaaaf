var express = require('express');
var router = express.Router();
var Comments = require('../models/Comments')

//render comment form
router.get('/:id/edit',(req,res)=>{
    let id = req.params.id
    Comments.findById(id,(err,comment)=>{
        if(err) return next(err)
        res.render('commentEdit',{comment})
    })
})

// update comment
router.post('/:id/edit',(req,res)=>{
    let id = req.params.id
    Comments.findByIdAndUpdate(id, req.body, (err,comment)=>{
        if(err) return next(err)
        res.redirect('/articles/'+ comment.articleId)
    })
})

//delete comment
router.get('/:id/delete',(req,res)=>{
    let id = req.params.id
   Comments.findByIdAndDelete(id)
})


//like comment
router.get('/:id/like',(req,res)=>{
    let id  = req.params.id
    Comments.findByIdAndUpdate(id, {$inc: {likes: +1}},(err,comment)=>{
        if(err) return next(err)
        res.redirect('/articles/'+ comment.articleId)
    })
})

//dislike comment
router.get('/:id/dislike',(req,res)=>{
    let id  = req.params.id
    Comments.findById(id,(err,comment)=>{
        if(comment.likes>0){
 Comments.findByIdAndUpdate(id, {$inc: {likes: -1}},(err,comment)=>{
        if(err) return next(err)
        res.redirect('/articles/'+ comment.articleId)
    })
        }else{
            res.redirect('/articles/'+ comment.articleId)
        }
    })
   
})

module.exports = router;