const express = require('express');
const router = express.Router();
const multer  = require('multer')
const path = require('path');

const Blog = require('../models/blog');
const Comment = require('../models/comment');
const Functions = require('../middlewares/functions');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(`./public/uploads/`));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
})

const upload = multer({ storage: storage })

router.get('/add-new', async (req,res) => {
	res.render('addBlog',{
        user: req.user
    });
});

router.get('/:id', async (req,res) => {
	const blog = await Blog.findById(req.params.id).populate('createdBy');
  const comments = await Comment.find({}).populate('createdBy');
  let comments_additional_values = {};
  comments.forEach((comment) => {
    //comment.timeAgo = Functions.formatTimeAgo(comment.createdAt);
    comments_additional_values[comment._id] = { 'ago': Functions.formatTimeAgo(comment.createdAt) }; 
  });
  
  //console.log(comments_additional_values);
  
  res.render('blog',{
    user: req.user,
    blog: blog,
    comments_additional_values: comments_additional_values,
    comments: comments
  });
});

router.post('/comment/:blogId', async (req,res) => {
  const comment = await Comment.create({
        content: req.body.comment,
        blogId: req.params.blogId,
        createdBy: req.user._id
    });

    return res.redirect(`/blog/${req.params.blogId}`);
}); 

router.post('/', upload.single('coverImage') ,async (req,res) => {
	const {title, body, coverImage} = req.body;
    const blog = await Blog.create({
        title,
        body,
        createdBy: req.user._id,
        coverImageURL: `/uploads/${req.file.filename}`
    });

    return res.redirect(`/blog/${blog._id}`);
});

module.exports = router;