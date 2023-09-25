// create web server with express
const express = require('express');
const app = express();
const port = 3000;
// create database connection
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/express-demo', {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => console.log('Cannot connect to MongoDB', err));
// create schema
const commentSchema = new mongoose.Schema({
    name: String,
    text: String,
    date: {type: Date, default: Date.now}
});
// create model
const Comment = mongoose.model('Comment', commentSchema);
// set view engine
app.set('view engine', 'pug');
app.set('views', './views');
// use static files
app.use(express.static('public'));
// use body parser
app.use(express.json());
app.use(express.urlencoded({extended: true}));
// create route
app.get('/', async (req, res) => {
    const comments = await Comment.find().sort('-date');
    res.render('index', {
        comments: comments
    });
});
app.post('/', async (req, res) => {
    const comment = new Comment({
        name: req.body.name,
        text: req.body.text
    });
    await comment.save();
    res.redirect('/');
});
// listen to port
app.listen(port, () => console.log(`Listening to port ${port}...`));
