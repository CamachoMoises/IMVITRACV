const sql = require('./database');

const Worker= function(worker){
    this.firstName= worker.firstName;
    this.firstLastname= worker.firstLastname;
}
Worker.List= async ()=> {
    try {
		return await sql.query('select * from bgoescmoyuocwga4lecd.workers');
	} catch (err) {
		return { err: err };
	}
}

module.exports= Worker;