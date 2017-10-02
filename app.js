const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const path = require('path');
const marked = require('marked');
const fs = require('fs');
const logger = require('winston');
const routes = require('./routes');
const authenticate = require('./middleware/auth');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(morgan('dev'));

// view engine setup
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// app.all('/api/v1/*', [authenticate]);
app.use('/', routes);

app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

if (require.main === module) {
  mongoose.connect('mongodb://localhost/users');
  app.listen(8000, () => {
    logger.info('Listening at http://localhost:8000 - see here for API docs');
  });
}

module.exports = app;