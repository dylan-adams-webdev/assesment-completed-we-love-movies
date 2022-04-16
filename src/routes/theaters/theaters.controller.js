const service = require('./theaters.service');
const asyncErrorBoundary = require('../../errors/asyncErrorBoundary');
const reduceProperties = require('../../utils/reduce-properties');

const reduceTheaterAndMovies = reduceProperties('theater_id', {
	movie_id: ['movies', null, 'movie_id'],
	title: ['movies', null, 'title'],
	runtime_in_minutes: ['movies', null, 'runtime_in_minutes'],
	rating: ['movies', null, 'rating'],
	description: ['movies', null, 'description'],
	image_url: ['movies', null, 'image_url'],
	m_created_at: ['movies', null, 'created_at'],
	m_updated_at: ['movies', null, 'updated_at'],
	is_showing: ['movies', null, 'is_showing'],
	m_theater_id: ['movies', null, 'theater_id'],
});

const list = async (req, res) => {
	const { movieId } = req.params;
	let data = null;
	if (movieId) {
		data = await service.findTheatersByMovie(movieId);
	} else {
		data = await service.list();
		data = reduceTheaterAndMovies(data);
	}
	
	res.json({ data: data });
};

const theaterExists = async (req, res, next) => {
	const { theaterId } = req.params;
	const theater = await service.read(theaterId);
	if (theater) {
		res.locals.theater = theater;
		return next();
	}
	next({
		status: 404,
		message: `theater with id ${theaterId} does not exist`,
	});
};

const read = (req, res) => {
	res.json({ data: res.locals.theater });
}

module.exports = {
	list: asyncErrorBoundary(list),
	read: [asyncErrorBoundary(theaterExists), read]
};
