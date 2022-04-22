var express = require('express');
var router = express.Router();
let Article = require('../models/Article')

/* GET users listing. */
router.get('/', function(req, res, next) {
  Article.find({},(err,articles)=>{
    if(err) return next(err)
    res.render('allArticles.ejs',{articles:articles})
  })
});

// rendering the form
router.get('/new',(req,res)=>{
res.render('articleForm.ejs')
})

//post the form
router.post('/',(req,res,next)=>{
  Article.create(req.body, (err,article)=>{
    if(err) return next(err)
    res.redirect('/articles')
  })
})

//single article
router.get('/:id',(req,res,next)=>{
  let id = req.params.id
  Article.findById(id,(err,article)=>{
    if(err) return next(err)
    res.render('singleArticle.ejs',{article})
  })
})


//edit article
router.get('/:id/edit',(req,res,next)=>{
  let id = req.params.id
  Article.findById(id,(err,article)=>{
    if(err) return next(err)
    res.render('updateArticle.ejs',{article})
  })
})

//LIKE
router.get('/:id/like',(req,res,next)=>{
  let id = req.params.id
  Article.findByIdAndUpdate(id,{$inc:{likes:+1}},(err,article)=>{
    if(err) return next(err)
    //redirect to the list of the articles
    res.redirect('/articles/'+id)
  })
})

//dislike
router.get('/:id/dislike',(req,res,next)=>{
  let id = req.params.id

Article.findById(id, (err,article)=>{
  if(article.likes > 0){
    Article.findByIdAndUpdate(id,{$inc: {likes:-1}},(err,article)=>{
      if(err) return next(err)
      //redirect to the list of the articles
      res.redirect('/articles/'+id)
    })
  }else{
    res.redirect('/articles/'+id)
  }
})
 
})

//post the edit form
router.post('/:id',(req,res,next)=>{
  let id = req.params.id
  Article.findByIdAndUpdate(id,req.body,(err,article)=>{
    if(err) return next(err)
    //redirect to the list of the articles
    res.redirect('/articles'+id)
  })
})

//delte
router.get('/:id/delete',(req,res,next)=>{
  let id = req.params.id
  Article.findByIdAndDelete(id,(err,article)=>{
    if(err) return next(err)
    //redirect to the list of the articles
    res.redirect('/articles/')
  })
})



module.exports = router;
