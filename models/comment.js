const mongoose = require('mongoose');
const { createHmac, randomBytes } = require('node:crypto');
const { createTokenForcomment,validateToken } = require('../services/authentication');

//Schema::
const commentSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },blogId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'blog',
    },createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
    }
},{timestamps: true});


//Model
const Comment = mongoose.model('comment',commentSchema);

module.exports = Comment;
