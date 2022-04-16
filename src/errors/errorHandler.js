function errorHandler(error, req, res, next) {
	const { status = 500, message = 'Internal server error' } = error;
	res.status(status).json({ error: message });
}

module.exports = errorHandler;