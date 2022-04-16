function notFound (req, res, next) {
	next({
		status: 404,
		message: `path not found: ${req.originalUrl}`,
	});
}

module.exports = notFound;