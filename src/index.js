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

const SQFunction = async (request, response)=>{
	const testConnection = await testSQL();
	if (testConnection.err) {
		console.log('Error in the database', testConnection.err);
		return res.status(400).json({ statusCode: 400, message: 'Error in the database' });
	}
	let testConnections = testConnection[0][0];

	console.log('Body', testConnections);
	response.send( testConnections);
}
const handle = (request, response)=>{
	
	console.log('Body');
	response.send( 'Hola mundo');
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
app.get('/', (req, res)=>{
	res.json('Hola')
})
app.get('/test', handle);
app.get('/testSQL', SQFunction);

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
