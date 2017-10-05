const express = require('express')
  , mongoose = require('mongoose')
  , cors = require('cors')
  , bodyParser = require('body-parser')
  , morgan = require('morgan')
  , path = require('path')
  , logger = require('winston')
  , routes = require('./routes');
//   , authenticate = require('./middleware/auth');

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
  mongoose.connect('mongodb://localhost:27017/users');
  const port = 9001;
  const host = '0.0.0.0';
  app.listen(port, host, () => { logger.info('Listening at http://localhost:8000'); });
}

module.exports = app;