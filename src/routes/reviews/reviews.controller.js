const service = require('./reviews.service');
const asyncErrorBoundary = require('../../errors/asyncErrorBoundary');

const itemExists = async (req, res, next) => {
	const methodName = 'itemExists';
	req.log.debug({ __filename, methodName });
	const { reviewId, movieId } = req.params;
	let review = null;
	if (movieId) {
		review = await service.readReviewAndCriticByMovie(movieId);
		req.log.trace({ __filename, methodName, movieId, reviewId, review });
	} else {
		review = await service.readReview(reviewId);
		req.log.trace({ __filename, methodName, foundReview: review });
	}
	if (review) {
		res.locals.review = review;
		req.log.trace({ __filename, methodName, return: true });
		return next();
	}
	const message = `review cannot be found`;
	req.log.trace({
		__filename,
		methodName,
		return: false,
		status: 404,
		message,
	});
	next({
		status: 404,
		message: message,
	});
};

const readReviewByMovie = (req, res) => {
	const methodName = 'readReviewByMovie';
	req.log.debug({
		__filename,
		methodName,
		return: true,
		data: res.locals.review,
	});
	res.json({ data: res.locals.review });
};

const update = async (req, res, next) => {
	const methodName = 'update';
	req.log.debug({ __filename, methodName });
	const { review } = res.locals;
	const { data = {} } = req.body;
	const { review_id, ...rest } = data;
	let updatedReview = {
		...review,
		...rest,
	};
	await service.updateReview(updatedReview);
	const newQuery = await service.readReviewAndCritic(req.params.reviewId);
	req.log.trace({
		__filename,
		methodName,
		existingRecord: review,
		updatedRecord: newQuery,
		return: true,
	});
	res.json({ data: newQuery });
};

const destroy = async (req, res) => {
	const methodName = 'destroy';
	req.log.debug({ __filename, methodName });
	await service.destroyReview(req.params.reviewId);
	req.log.trace({ __filename, methodName, idToDelete: req.params.reviewId, return: true });
	res.sendStatus(204);
};

module.exports = {
	update: [asyncErrorBoundary(itemExists), asyncErrorBoundary(update)],
	delete: [asyncErrorBoundary(itemExists), asyncErrorBoundary(destroy)],
	listReviewByMovie: [
		asyncErrorBoundary(itemExists),
		asyncErrorBoundary(readReviewByMovie),
	],
};
