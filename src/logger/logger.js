const { nanoid } = require('nanoid');
const pino = require('pino');

const level = process.env.LOG_LEVEL || 'info';
const prettyPrint = process.env.NODE_ENV === 'development';

// TODO output to db instead of stdout
const logger = pino(
	{
		genReqId: (request) => request.headers['x-request-id'] || nanoid(),
		level,
		prettyPrint,
	},
	pino.destination(`${__dirname}/events.log`)
);

module.exports = logger;
