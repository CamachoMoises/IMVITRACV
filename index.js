require('dotenv').config();
const morgan = require('morgan');
const express = require('express');
const app = express();
const cloudinary = require('cloudinary');
const User = require('./src/controller/user');
const WorkerDB = require('./src/database/worker');
const cors = require('cors');
const admin = require('firebase-admin');

const { getDatabase } = require('firebase-admin/database');
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');
const serviceAccount = require('./imvitracv-6aa26-firebase-adminsdk-o6ux4-5791e822c4.json');
admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
	databaseURL: 'https://imvitracv-6aa26-default-rtdb.firebaseio.com/',
});
admin.firestore().settings({ignoreUndefinedProperties:true})
const WorkerFire = require('./src/database/firebase/worker');
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

// app.get('/store', async (req, res) => {
// 	const aTuringRef = await dbFire.collection('users').add({
// 		first: 'moises',
// 		middle: 'alberto',
// 		last: 'Camacho',
// 		born: 1994,
// 	});

// 	res.json('Added document with ID: ' + aTuringRef.id);
// });

// app.get('/cities', async (req, res) => {
// 	const citiesRef = dbFire.collection('cities');

// 	await citiesRef.doc('SF').set({
// 		name: 'San Francisco',
// 		state: 'CA',
// 		country: 'USA',
// 		capital: false,
// 		population: 860000,
// 		regions: ['west_coast', 'norcal'],
// 	});
// 	await citiesRef.doc('LA').set({
// 		name: 'Los Angeles',
// 		state: 'CA',
// 		country: 'USA',
// 		capital: false,
// 		population: 3900000,
// 		regions: ['west_coast', 'socal'],
// 	});
// 	console.log('City add', citiesRef.id);

// 	await citiesRef.doc('DC').set({
// 		name: 'Washington, D.C.',
// 		state: null,
// 		country: 'USA',
// 		capital: true,
// 		population: 680000,
// 		regions: ['east_coast'],
// 	});
// 	console.log('City add', citiesRef.id);

// 	await citiesRef.doc('TOK').set({
// 		name: 'Tokyo',
// 		state: null,
// 		country: 'Japan',
// 		capital: true,
// 		population: 9000000,
// 		regions: ['kanto', 'honshu'],
// 	});
// 	console.log('City add', citiesRef.id);

// 	await citiesRef.doc('BJ').set({
// 		name: 'Beijing',
// 		state: null,
// 		country: 'China',
// 		capital: true,
// 		population: 21500000,
// 		regions: ['jingjinji', 'hebei'],
// 	});
// 	console.log('City add', citiesRef.id);
// 	res.json('added')
// });

// app.get('/list', async (req, res) => {
// 	const snapshot = await dbFire.collection('cities').offset(3).limit(2).get();

// 	const response = [];
// 	snapshot.forEach((doc) => {
// 		console.log(doc.id, '=>', doc.data());
// 		response.push({ ...{ id: doc.id }, ...doc.data() });
// 	});

// 	res.json(response);
// 	setTimeout(() =>{
// 		console.log('Ojo');
// 	}, 5000)
// });
app.get('/', (req, res) => {
	const test = {
		name: 'Count',
		value: 5,
	};
	// db.ref('test_Collection').limitToFirst(4).once('value').then(
	// 	(snapshot) => {
	// 		const newData = snapshot
	// 		const response =[]
	// 		newData.forEach((data) => {
	// 			console.log('The ' + data.key + ' dinosaur\'s score is ' + data.val());
	// 			response.push(
	// 				{...{id:data.key},
	// 				...data.val()}
	// 			)
	// 		  });
	// 		res.json(newData);
	// 	}
	// );
	// db.ref('workers_count').push(test).then(val=>{
	// })
	res.json('hola');
});

app.get('/profile/:id', async (req, res) => {
	const id = req.params.id;
	const profileNew = await WorkerFire.Profile(id);

	if (profileNew.err) {
		console.log('Error in the database', profileNew.err);
		return res.status(400).json({ statusCode: 400, message: 'Error in the database', error: profileNew.err });
	}
	const worker = profileNew.data();

	return res.json(worker);
});
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
