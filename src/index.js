require('dotenv').config();
const express = require('express');
const app = express();
const sql = require('./database/database');

app.use(express.static('build'));
app.use(express.json());

let testSQL= async ()=>{
	try {
		return await sql.query('call bgoescmoyuocwga4lecd.log_test()');
	} catch (err) {
		return { err: err };
	}
}


const handle = async (request, response)=>{
	const testConnection = await testSQL();
	if (testConnection.err) {
		console.log('Error in the database', testConnection.err);
		return res.status(400).json({ statusCode: 400, message: 'Error in the database' });
	}
	let testConnections = testConnection[0][0];

	console.log('Body', testConnections);
	response.send( testConnections);
}

console.log('Body', process.env.HOST);
const requestLogger = (request, response, next) => {
	console.log('Method:', request.method);
	console.log('Path:  ', request.path);
	console.log('Body:  ', request.body);
	console.log('---');
	next();
};

app.use(requestLogger);
app.get('/test', handle);

require('./route/user')(app);
require('./route/worker')(app);
require('./route/organization')(app);


const unknownEndpoint = (request, response) => {
	response.status(404).send({ error: 'unknown endpoint' });
};

app.use(unknownEndpoint);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
