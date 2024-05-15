var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var app = express();
var cors = require('cors');
const redColor = '\x1b[31m'; // Red
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// Custom logging middleware to log specific requests
const logRequests = (req, res, next) => {
    if (req.url === '/inven/master_data') {
        console.log(redColor,'Received potentially unprocessed request:', req.method, req.url);
    }
    next(); // Move to the next middleware or route handler
};

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
app.use(logRequests); // Attach custom logging middleware

// Route setup
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var inventoryRouter = require('./routes/inventory');
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/inven', inventoryRouter);

// Error handling middleware
app.use(function(req, res, next) {
    next(createError(404));
});

app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
