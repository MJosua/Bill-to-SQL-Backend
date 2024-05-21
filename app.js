const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const app = express();
const redColor = '\x1b[31m'; // Red

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

// Custom logging middleware to log specific requests
const logRequests = (req, res, next) => {
    if (req.url === '/inven/master_data') {
        console.log(redColor, 'Received potentially unprocessed request:', req.method, req.url);
    }
    next();
};

app.use(logRequests); // Attach custom logging middleware

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// Route setup
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const inventoryRouter = require('./routes/inventory');
const logrouter = require('./routes/log');

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/inven', inventoryRouter);
app.use('/log', logrouter);

// Error handling middleware
app.use((req, res, next) => {
    next(createError(404));
});

app.use((err, req, res, next) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
