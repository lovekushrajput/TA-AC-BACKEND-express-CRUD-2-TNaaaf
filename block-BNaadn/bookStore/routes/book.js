var express = require('express');
var router = express.Router();
var Book = require('../models/Book')
var multer = require('multer')
var fs = require('fs')

//define storage for image
var storage = multer.diskStorage({
  //destination for file
  destination: (req,file,cb)=>{
   cb(null,'./public/images')
  },

//filename for the file
filename: (req,file,cb)=>{
  cb(null,Date.now()+ file.originalname)
}
})

//upload parameter for the multer
let upload = multer({
  storage: storage
})

/* GET books listing. */
router.get('/', function(req, res, next) {
 Book.find({},(err,createdBook)=>{
  if(err) return next(err)
  res.render('allBook',{createdBook})
 })
});


// router.get('/bar',(req,res)=>{
//   res.render('bookSearch')
//   })


  router.post('/search',(req,res,next)=>{
    if(req.body.book==''){
      res.redirect('/books')
    }else{
      Book.find({category: req.body.book}&&{title: req.body.book} &&{author: req.body.book},(err,book)=>{
        if(err) return next(err)
        console.log(book)
      })
    }
  
  })
//render the book form
router.get('/new',(req,res)=>{
  res.render('bookForm')
})

// capture the data
router.post('/',upload.single('cover_image'),(req,res,next)=>{
  req.body.cover_image = req.file.filename
  Book.create(req.body, (err,book)=>{
if(err) return next(err)
res.redirect('/books')
   })
})

//book details
router.get('/:id',(req,res,next)=>{
let id = req.params.id
Book.findById(id,(err,book)=>{
  if(err) return next(err)

  res.render('bookDetails',{book})
})
})

//Edit book
router.get('/:id/edit',(req,res)=>{
  let id = req.params.id
  Book.findById(id,(err,book)=>{
    if(err) return next(err)
    res.render('bookEdit',{book})
  })
})

// capture the data and update
router.post('/:id',upload.single('cover_image'),(req,res,next)=>{
  let id = req.params.id
  let new_image = ''

  if(req.file){
    new_image = req.file.filename;
    try {
      
      //delete th old img
      fs.unlinkSync('./public/images/' +req.body.cover_image)
    } catch (error) {
      console.log(error)
    }
  }else{
    new_image = req.body.cover_image
  }
  req.body.cover_image = new_image
  Book.findByIdAndUpdate(id,req.body,(err,book)=>{
if(err) return next(err)
res.redirect('/books/'+ id)
  })
})

// delete book
router.get('/:id/delete',(req,res)=>{
  let id = req.params.id
  Book.findByIdAndDelete(id, (err,book)=>{
    if(book.cover_image!==''){
      try {
        fs.unlinkSync('./public/images/' + book.cover_image)
      } catch (error) {
        console.log(error)
      }
    }else{
      res.redirect('/books')
    }
    if(err) return next(err)
    res.redirect('/books/')
  })
})

// search bar



module.exports = router;
