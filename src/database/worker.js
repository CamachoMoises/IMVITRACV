const sql = require('./database');

const Worker = function (worker) {
	this.firstName = worker.firstName;
	this.firstLastname = worker.firstLastname;
	this.firstLastname = worker.firstLastname;
	this.workerCode = worker.workerCode;
	this.status = worker.status;
};

Worker.List = async ()=> {
    try {
		return await sql.query('call bgoescmoyuocwga4lecd.list_workers();');
	} catch (err) {
		return { err: err };
	}
};


module.exports = Worker;
