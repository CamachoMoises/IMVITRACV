const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const saltRounds = 10;
const User = require('../database/user');

exports.List = async (req, res) => {
	const users = await User.List();
	const US = users[0][0];
	res.json(US);
};
exports.Authenticate = async (req, res, next) => {
	console.log('Login');
	const password = req.body.password;
	let secret = 'some_secret';
	const data = {
		user: req.body.username.toLowerCase(),
		pwd: req.body.password,
	};
	const userVerified = await User.findEmail(req.body.username);
	if (userVerified.err) {
		console.log('Error in the database', userVerified.err);
		return res.status(400).json({ statusCode: 400, message: 'Error in the database' });
	}
	const person = userVerified[0];
	if (person.length < 1) {
		return res.status(400).json({ statusCode: 400, message: 'User not exist', error: 'User not exist' });
	}
	if (person[0].status === 0) {
		return res.status(400).json({ statusCode: 400, message: 'User inactive', error: 'User inactive' });
	}

	const results = await User.Authenticate(data);
	if (results.err) {
		console.log('Error in the database');
		return res.status(400).json({ statusCode: 400, message: 'Error in the database' });
	}
	const user = results[0][0];
	const storedPassword = user.password;
	const userData = {
		userName: user.userName,
		id: user.idUser,
	};
    const isEqual = await bcrypt.compare(password, storedPassword);
	if (!isEqual) {
		console.log(`the password does not match the User: ${data.user}`);
		return res.status(400).json({ statusCode: 400, message: `the password does not match the User: ${data.user}` });
	}
	const token = jwt.sign(userData, secret, { expiresIn: '50m' });
	const userF = {
		userName: user.userName,
		id: user.idUser,
		password: user.password,
		token: token,
		status: user.status,
	};
	return res.json(userF);
};

exports.encrypt = async () => {
    console.log('verify encrypt');
	const Encrypt = async (password) => {
		return await bcrypt.hash(password, saltRounds);
	};
    const UnEncrypt = await User.UnEncrypt();
	if (UnEncrypt.err) {
		console.log('Error in the database', UnEncrypt.err);
	}
    const users= UnEncrypt
    users.forEach(async (user) => {
        console.log('user', user)
         if (user.encryption !==1) {
             const encryptedPassword = await Encrypt(user.password);
             console.log('contraseña', encryptedPassword, user.idUser);
	 		const data = {
	 			idUser: user.idUser,
	 			password: encryptedPassword,
	 		};
             await User.Encrypt(data);
             console.log('Contraseñas aseguradas');
         }
     })

}
