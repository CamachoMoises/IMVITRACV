const sql = require('./database');

// constructor
const User = function (user) {
	this.userName = user.userName;
	this.password = user.password;
	this.status = user.status;
};


User.List = async () => {
	try {
		return await sql.query('call list_users()');
	} catch (err) {
		return { err: err };
	}
};

User.findEmail = async (email) => {
	try {
		return await sql.query('SELECT status FROM users WHERE userName=?', [email]);
	} catch (err) {
		return { err: err };
	}
};

User.Authenticate = async (data) => {
	try {
		return await sql.query('SELECT userName, password, idUser, status FROM users WHERE userName=?', [data.user]);
	} catch (err) {
		return { err: err };
	}
};

User.UnEncrypt = async () => {
	try {
		const password = await sql.query('SELECT * FROM users WHERE encryption=false');
		return password[0];
	} catch (err) {
		return { err: err };
	}
};

User.Encrypt = async (data) => {
	try {
		const password = await sql.query('UPDATE users SET `password`=? , `encryption`=1 WHERE (`idUser` = ?);', [data.password, data.idUser]);
	} catch (err) {
		console.log(err);
	}
}

module.exports = User;
