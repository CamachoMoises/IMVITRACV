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
		return await sql.query('SELECT userName, idUsers, status FROM bgoescmoyuocwga4lecd.users WHERE userName=?', [email]);
	} catch (err) {
		return { err: err };
	}
};


module.exports = User;