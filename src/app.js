if (process.env.USER) require('dotenv').config();
const express = require('express');
const logger = require('./logger/logger');
const expressPino = require('express-pino-logger');
const cors = require('cors');
const moviesRouter = require('./routes/movies/movies.router');
const theatersRouter = require('./routes/theaters/theaters.router');
const reviewsRouter = require('./routes/reviews/reviews.router');
const notFound = require('./errors/notFound');
const errorHandler = require('./errors/errorHandler');

const app = express();

const loggerMiddleware = expressPino({ logger });

app.use(loggerMiddleware);
app.use(cors());
app.use(express.json());

app.use('/movies', moviesRouter);
app.use('/theaters', theatersRouter);
app.use('/reviews', reviewsRouter);

app.use(notFound);
app.use(errorHandler);
module.exports = app;
