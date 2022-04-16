const service = require('./reviews.service');
const asyncErrorBoundary = require('../../errors/asyncErrorBoundary');

const itemExists = async (req, res, next) => {
	const { reviewId, movieId } = req.params;
	let review = null;
	if (movieId) {
		review = await service.readReviewAndCriticByMovie(movieId);
	} else {
		review = await service.readReview(reviewId);
	}
	if (review) {
		res.locals.review = review;
		return next();
	}
	const message = `review cannot be found`;
	next({
		status: 404,
		message: message,
	});
};

const readReviewByMovie = (req, res) => {
	res.json({ data: res.locals.review });
};

const update = async (req, res, next) => {
	const { review } = res.locals;
	const { data = {} } = req.body;
	const { review_id, ...rest } = data;
	let updatedReview = {
		...review,
		...rest,
	};
	await service.updateReview(updatedReview);
	const newQuery = await service.readReviewAndCritic(req.params.reviewId);
	res.json({ data: newQuery });
};

const destroy = async (req, res) => {
	await service.destroyReview(req.params.reviewId);
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
