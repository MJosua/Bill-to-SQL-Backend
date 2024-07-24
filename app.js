const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const createError = require('http-errors');

const app = express();

// Set up view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

// Serve static files from the "uploads" directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Custom logging middleware to log specific requests
app.use((req, res, next) => {
  if (req.url.startsWith('/uploads')) {
    console.log('Serving static file:', req.url);
  }
  next();
});

// Route setup
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const inventoryRouter = require('./routes/inventory');
const logRouter = require('./routes/log');
const billToRoute = require('./routes/BillToScan');

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/inven', inventoryRouter);
app.use('/log', logRouter);
app.use('/BillToScan', billToRoute);

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
