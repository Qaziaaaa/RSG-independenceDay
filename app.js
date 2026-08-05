const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const routes = require('./routes');
const notFound = require('./middlewares/notFound');
const errorHandler = require('./middlewares/errorHandler');
const { NODE_ENV } = require('./config');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, message: 'Server is running', data: {} });
});

app.use('/api', routes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
