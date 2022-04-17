const service = require('./movies.service');
const asyncErrorBoundary = require('../../errors/asyncErrorBoundary');

const list = async (req, res) => {
	const methodName = 'list';
	req.log.debug({ __filename, methodName });
	let data = null;
	if (!req.query.is_showing) {
		data = await service.list();
	} else {
		data = await service.listShowing();
	}
	res.json({ data: data });
	req.log.trace({ __filename, methodName, return: true, data });
};

const itemExists = async (req, res, next) => {
	const methodName = 'itemExists';
	req.log.debug({ __filename, methodName });
	const { movieId } = req.params;
	const movie = await service.read(movieId);
	if (movie) {
		req.log.trace({
			__filename,
			methodName,
			return: true,
			foundMovie: movie,
		});
		res.locals.movie = movie;
		return next();
	}
	const message = `movie with id ${movieId} does not exist`;
	req.log.trace({
		__filename,
		methodName,
		return: false,
		status: 404,
		message,
	});
	next({ status: 404, message: message });
};

const read = (req, res) => {
	const methodName = 'read';
	req.log.debug({ __filename, methodName });
	res.json({ data: res.locals.movie });
	req.log.trace({
		__filename,
		methodName,
		return: true,
		data: res.locals.movie,
	});
};

module.exports = {
	list: asyncErrorBoundary(list),
	read: [asyncErrorBoundary(itemExists), read],
	itemExists: asyncErrorBoundary(itemExists),
};
