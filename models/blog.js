const mongoose = require('mongoose');
const { createHmac, randomBytes } = require('node:crypto');
const { createTokenForblog,validateToken } = require('../services/authentication');

//Schema::
const blogSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true
	},body: {
		type: String,
		required: true
	},coverImageURL: {
		type: String,
        required: false
	},createdBy: {
		type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
	}
},{timestamps: true});


//Model
const Blog = mongoose.model('blog',blogSchema);

module.exports = Blog;
