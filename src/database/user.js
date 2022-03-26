const sql = require('./database');

// constructor
const User = function (user) {
	this.userName = user.userName;
	this.password = user.password;
	this.status = user.status;
};


User.List = async () => {
	try {
		return await sql.query('call bgoescmoyuocwga4lecd.list_users()');
	} catch (err) {
		return { err: err };
	}
};

User.findEmail = async (email) => {
	try {
		return await sql.query('SELECT status FROM bgoescmoyuocwga4lecd.users WHERE userName=?', [email]);
	} catch (err) {
		return { err: err };
	}
};

User.Authenticate = async (data) => {
	try {
		return await sql.query('SELECT userName, password, idUser, status FROM bgoescmoyuocwga4lecd.users WHERE userName=?', [data.user]);
	} catch (err) {
		return { err: err };
	}
};

User.UnEncrypt = async () => {
	try {
		const password = await sql.query('SELECT * FROM bgoescmoyuocwga4lecd.users WHERE encryption=false');
		return password[0];
	} catch (err) {
		return { err: err };
	}
};

User.Encrypt = async (data) => {
	try {
		const password = await sql.query('UPDATE bgoescmoyuocwga4lecd.users SET `password`=? , `encryption`=1 WHERE (`idUser` = ?);', [data.password, data.idUser]);
	} catch (err) {
		console.log(err);
	}
}

module.exports = User;
