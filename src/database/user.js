const sql = require('./database');

// constructor
const User = function (user) {
	this.nombreusuario = user.nombreusuario;
	this.claveusuario = user.claveusuario;
	this.estado = user.estado;
};

User.List = async () => {
	try {
		return await sql.query('call bgoescmoyuocwga4lecd.log_test()');
	} catch (err) {
		return { err: err };
	}
};


module.exports = User;