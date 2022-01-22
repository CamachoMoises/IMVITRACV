const expressJWT	= require('express-jwt');
const User 			= require('../controller/user');
const cors 			= require('cors');
const UserDB		=require('../database/user.js');
module.exports = (app) => {
    app.use(cors());
    let secret = 'some_secret';
    //app.use(expressJWT({ secret: secret, algorithms: ['HS256'] }).unless({ path: ['/api/login'] }));

    app.get('/users', User.List);

	app.post('/singUp', async (req, res, next) => {
		console.log('username',req.body.username);
		const email = await UserDB.findEmail(req.body.username);
		if (email.errs) {
			console.log(email.err);
			return res.json('error');
		}
		const person = email[0];
	
		if (person.length > 0) {
			return res.json('Email address found');
		}
		return res.json('created');
	});



}