require('dotenv').config();
const morgan = require('morgan');
const express = require('express');
const app = express();
const cloudinary = require('cloudinary');
const User 	= require('./src/controller/user');
const WorkerDB = require('./src/database/worker');
const cors = require('cors');
const qr = require("qrcode");

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
User.encrypt();
app.use(cors());


app.get('/', (req, res) => {
	res.json('Hola');
});

app.get('/profile/:id', async (req, res)=> {
	const id = req.params.id;
	const profileNew = await WorkerDB.Profile(id)
	if (profileNew.err) {
		console.log('Error in the database', profileNew.err);
		return res.status(400).json({ statusCode: 400, message: 'Error in the database', error: profileNew.err });
	}
	const url=`https://imvitracv-6aa26.firebaseapp.com/profile/${id}`;
	let worker= profileNew[0][0];
	await qr.toDataURL(url, (err, src) => {
		if (err) {
			console.error("Error occured");
			worker.qrCode=null;
		}else{
			worker.qrCode=src;
		};
		return res.json(worker);
    });
	
})
require('./src/route/user')(app);
require('./src/route/worker')(app);

const unknownEndpoint = (request, response) => {
	response.status(404).send({ error: 'unknown endpoint' });
};
app.use(unknownEndpoint);
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
