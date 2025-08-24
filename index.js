const express = require('express'); 
const path = require('path');
const cookieParser = require('cookie-parser');

const app = express();
const PORT = 8000;

//middlewares
const { checkForAuthenticationCookie } = require('./middlewares/authentication');

//Routes
const userRoute = require('./routes/user');
const blogRoute = require('./routes/blog');

//Connect
const {connectMongoDb} = require('./connect');
const dbURI = 'mongodb://127.0.0.1:27017/blog'; 

//models
const Blog = require('./models/blog');

connectMongoDb(dbURI).then(() => console.log('MongoDB connected successfully!')).catch(err => console.error('MongoDB connection error:', err));

app.set('view engine', 'ejs');
app.set('views', path.resolve('./views'));

app.use( express.json() );
app.use( express.urlencoded({extended: false}) );
app.use(cookieParser());
app.use(checkForAuthenticationCookie('token'));
app.use(express.static(path.resolve('./public')));

app.use('/user', userRoute);
app.use('/blog', blogRoute);

app.get('/', async (req, res) => {
	const allBlogs = await Blog.find({});
	res.render('home',{
		user: req.user,
		blogs: allBlogs
	});
});

app.listen(PORT,() => {
	console.log('Server Started');
});