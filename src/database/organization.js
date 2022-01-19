const sql = require('./database');


// constructor
const Organization = function (organization) {
	this.name = user.name;
	this.RIF = user.RIF;
	this.zone = user.zone;
};

Organization.List = async ()=> {
    try {
		return await sql.query('call bgoescmoyuocwga4lecd.list_organizations()');
	} catch (err) {
		return { err: err };
	}
}



module.exports = Organization;