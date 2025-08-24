const express = require('express');
const router = express.Router();
const User = require('../models/user');

router.get('/signin', (req,res) => {
	res.render('signin');
});

router.get('/signup', (req,res) => {
	res.render('signup');
});

router.post('/signup', async (req,res) => {
	//const {fullName, email, password, profileImageUrl, salt, role} = req.body;
    const {fullName, email, password} = req.body;
    await User.create({
        fullName,
        email,
        password
    });

    return res.redirect('/');
});

router.post('/signin', async (req,res) => {
	//const {fullName, email, password, profileImageUrl, salt, role} = req.body;
    const {email, password} = req.body;
    try{
        const token = await User.matchPasswordAndGenerateToken(email, password);
        return res.cookie('token', token).redirect('/');
    }catch(error){
        res.render('signin',{
            error: 'Incorrect Email OR Password.',
        });
    }
});

router.get('/logout', async (req,res) => {
	res.clearCookie('token').redirect('/');
});

module.exports = router;