const knex = require('../../db/connection');

const list = () => {
	return knex('movies').select('*');
};

const listShowing = () => {
	return knex('movies as m')
		.select('m.*', 'mt.is_showing')
		.join('movies_theaters as mt', { 'mt.movie_id': 'm.movie_id' })
		.distinct()
		.where({ is_showing: true });
};

const read = (movie_id) => {
	return knex('movies').where({ movie_id }).first();
};

module.exports = {
	list,
	listShowing,
	read,
};
