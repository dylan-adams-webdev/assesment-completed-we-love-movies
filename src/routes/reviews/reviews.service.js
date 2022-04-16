const knex = require('../../db/connection');
const mapProperties = require('../../utils/map-properties');

const addCriticAllConfig = {
	critic_id: 'critic.critic_id',
	preferred_name: 'critic.preferred_name',
	surname: 'critic.surname',
	organization_name: 'critic.organization_name',
	c_created_at: 'critic.created_at',
	c_updated_at: 'critic.updated_at',
};

const addCriticMinConfig = {
	preferred_name: 'critic.preferred_name',
	surname: 'critic.surname',
	organization_name: 'critic.organization_name',
};

const readReview = (review_id) => {
	return knex('reviews').where({ review_id }).first();
};

const readReviewAndCritic = (review_id) => {
	return knex('reviews as r')
		.join('critics as c', { 'r.critic_id': 'c.critic_id' })
		.select(
			'r.*',
			'c.critic_id',
			'c.preferred_name',
			'c.surname',
			'c.organization_name'
		)
		.where({ 'r.review_id': review_id })
		.first()
		.then((res) => mapProperties(addCriticMinConfig)(res));
};

const readReviewAndCriticByMovie = (movie_id) => {
	return knex('reviews as r')
		.join('critics as c', {
			'r.critic_id': 'c.critic_id',
		})
		.select(
			'r.*',
			'c.critic_id',
			'c.preferred_name',
			'c.surname',
			'c.organization_name',
			'c.created_at as c_created_at',
			'c.updated_at as c_updated_at'
		)
		.where({ 'r.movie_id': movie_id })
		.then((res) =>
			res.map((item) => mapProperties(addCriticAllConfig)(item))
		);
};

const updateReview = (review) => {
	return knex('reviews')
		.where({ review_id: review.review_id })
		.update(review);
};

const destroyReview = (review_id) => {
	return knex('reviews').where({ review_id }).del();
};

module.exports = {
	readReview,
	readReviewAndCritic,
	readReviewAndCriticByMovie,
	updateReview,
	destroyReview,
};
