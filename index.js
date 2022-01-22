require('dotenv').config();
const morgan = require('morgan');
const express = require('express');
const app = express();
const sql = require('./src/database/database');
const cloudinary = require('cloudinary');

global.__basedir = __dirname;

cloudinary.config({
	cloud_name: 'moisesinc',
	api_key: '886546164878929',
	api_secret: 'sTFlN5y69sCC3kr97GTcyZiEWCA',
	secure: true,
});

morgan.token('body', (req, res) => {
	if (req.body.username) {
		return JSON.stringify(req.body);
	}
	return 'not body';
});

morgan.token('url', (req, res) => {
	return req.url;
});
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));


app.use(express.json());
app.use(express.raw());
app.use(express.urlencoded({ extended: true }));

// const requestLogger = (request, response, next) => {
// 	console.log('Method:', request.method);
// 	console.log('Path:  ', request.path);
// 	console.log('Body:  ', request.body);
// 	console.log('---');
// 	next();
// };

//app.use(requestLogger);
app.get('/', (req, res) => {
	res.json('Hola');
});

require('./src/route/user')(app);
require('./src/route/worker')(app);
require('./src/route/organization')(app);

const unknownEndpoint = (request, response) => {
	response.status(404).send({ error: 'unknown endpoint' });
};

app.use(unknownEndpoint);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
