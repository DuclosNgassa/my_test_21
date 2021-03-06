const createError = require('http-errors');
const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

//Router
const usersRouter = require('./routes/users');
const postsRouter = require('./routes/posts');
const imagesRouter = require('./routes/images');
const categoriesRouter = require('./routes/categories');
const messagesRouter = require('./routes/messages');
const favoritsRouter = require('./routes/favorits');
const userNotificationRouter = require('./routes/userNotification');

const app = express();

app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static('public'));

app.use('/users', usersRouter);
app.use('/posts', postsRouter);
app.use('/images', imagesRouter);
app.use('/categories', categoriesRouter);
app.use('/messages', messagesRouter);
app.use('/favorits', favoritsRouter);
app.use('/userNotification', userNotificationRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
