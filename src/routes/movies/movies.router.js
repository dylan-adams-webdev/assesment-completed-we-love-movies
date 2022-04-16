const router = require('express').Router();
const controller = require('./movies.controller');
const methodNotAllowed = require('../../errors/methodNotAllowed');
const theatersRouter = require('../theaters/theaters.router');
const reviewsRouter = require('../reviews/reviews.router');

router.use('/:movieId/theaters', controller.itemExists, theatersRouter);
router.use('/:movieId/reviews', controller.itemExists, reviewsRouter);

router.route('/').get(controller.list).all(methodNotAllowed);
router.route('/:movieId').get(controller.read).all(methodNotAllowed);

module.exports = router;
