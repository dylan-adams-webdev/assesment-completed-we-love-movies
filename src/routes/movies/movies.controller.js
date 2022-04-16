const service = require('./movies.service');
const asyncErrorBoundary = require('../../errors/asyncErrorBoundary');

const list = async (req, res) => {
	let data = null;
	if (!req.query.is_showing) {
		data = await service.list();
	} else {
		data = await service.listShowing();
	}
	res.json({data: data})
}

const itemExists = async (req, res, next) => {
	const { movieId } = req.params;
	const movie = await service.read(movieId);
	if (movie) {
		res.locals.movie = movie;
		return next();
	}
	next({ status: 404, message: `movie with id ${movieId} does not exist` });
}

const read = (req, res) => {
	res.json({ data: res.locals.movie });
}

module.exports = {
	list: asyncErrorBoundary(list),
	read: [asyncErrorBoundary(itemExists), read],
	itemExists: asyncErrorBoundary(itemExists),
}