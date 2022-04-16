const knex = require('../../db/connection');

const list = () => {
	return knex('movies as m')
		.select([
			't.*',
			'mt.is_showing',
			'm.title',
			'm.movie_id',
			'm.runtime_in_minutes',
			'm.rating',
			'm.description',
			'm.image_url',
			'm.created_at as m_created_at',
			'm.updated_at as m_updated_at',
			'mt.theater_id as m_theater_id',
		])
		.join('movies_theaters as mt', { 'm.movie_id': 'mt.movie_id' })
		.join('theaters as t', { 't.theater_id': 'mt.theater_id' });
};

const findTheatersByMovie = (movie_id) => {
	return knex('theaters as t')
		.join('movies_theaters as mt', {'mt.theater_id': 't.theater_id'})
		.where({ 'mt.movie_id': movie_id });
};

module.exports = {
	list,
	findTheatersByMovie,
};
