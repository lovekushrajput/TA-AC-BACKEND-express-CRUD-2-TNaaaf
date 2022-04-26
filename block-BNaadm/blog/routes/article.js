var express = require('express');
var router = express.Router();
var Article = require('../models/Article')
var Comments = require('../models/Comments')

/* GET users listing. */
router.get('/', function (req, res, next) {
  Article.find({}, (err, articles) => {
    if (err) return next(err)
    res.render('allArticles', { articles: articles })
  })
});

//render a form
router.get('/new', (req, res) => {
  res.render('articleForm')
})

//post the form
router.post('/', (req, res, next) => {
  Article.create(req.body, (err, articles) => {
    if (err) return next(err)
    res.redirect('/articles')
  })
})

// articles details
router.get('/:id', (req, res, next) => {
  let id = req.params.id
  //using populate method
  Article.findById(id).populate('comments').exec((err, article) => {
    if (err) return next(err)
    res.render('articleDetails', { article: article })
  })
})

//edit article
router.get('/:id/edit', (req, res, next) => {
  let id = req.params.id
  Article.findById(id, (err, article) => {
    if (err) return next(err)
    res.render('articleEdit', { article: article })
  })
})

// update the form
router.post('/:id/edit', (req, res, next) => {
  let id = req.params.id
  Article.findByIdAndUpdate(id, req.body, (err, article) => {
    if (err) return next(err)
    res.redirect('/articles/' + id)
  })
})

// delete the article
router.get('/:id/delete', (req, res, next) => {
  let id = req.params.id
  Article.findByIdAndDelete(id, (err, article) => {
    if (err) return next(err)
    Comments.deleteMany({articleId: article._id},(err, info)=>{
      if (err) return next(err)
      res.redirect('/articles')
    })
   
  })
})

// likes
router.get('/:id/like', (req, res, next) => {
  let id = req.params.id
  Article.findByIdAndUpdate(id, { $inc: { likes: +1 } }, (err, article) => {
    if (err) return next(err)
    res.redirect('/articles/' + id)
  })
})

//dislike
router.get('/:id/dislike', (req, res, next) => {
  let id = req.params.id
  Article.findById(id, (err, article) => {
    if (article.likes > 0) {
      Article.findByIdAndUpdate(id, { $inc: { likes: -1 } }, (err, article) => {
        if (err) return next(err)
        res.redirect('/articles/' + id)
      })

    } else {
      res.redirect('/articles/' + id)
    }
  })

})

//creating the comment 
router.post('/:articleId/comments', (req, res, next) => {
  let id = req.params.articleId

 //appending article id
 if(req.body.content !== ""|| req.body.author !==""){
  req.body.articleId = id
  Comments.create(req.body, (err, comments) => {
    if (err) return next(err)

    //pushing comment id into article schema
    Article.findByIdAndUpdate(id, { $push: { comments: comments._id } }, (err, comment) => {
      if (err) return next(err)
      res.redirect('/articles/' + id)
    })
  })
}else{
  res.redirect('/articles/'+id)
}
})

module.exports = router;
