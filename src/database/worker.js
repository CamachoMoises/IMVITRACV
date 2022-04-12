const sql = require('./database');

const Worker = function (worker) {
	this.firstName = worker.firstName;
	this.firstLastname = worker.firstLastname;
};

Worker.Profile = async (id)=> {
	try {
		return await sql.query('SELECT * FROM workers WHERE (idWorker = ?)', [id]);
	} catch (err) {
		return { err: err };
	}
}

Worker.List = async (data) => {
	try {
		const workers = await sql.query(`SELECT * FROM workers  limit ${data.init}, ${data.size};`);
		const count = await sql.query(`SELECT count(*)  as dataLength from workers;`);
		return [workers[0], count[0][0]] 
	} catch (err) {
		return { err: err };
	}
};

Worker.ListFiltered = async (data) => {
	try {
		return await sql.query(`SELECT * FROM workers  
		Where 
		firstName Like '%${data.filter}%' Or 
		secondName Like '%${data.filter}%' Or 
		firstLastname Like '%${data.filter}%' Or
		secondLastname Like '%${data.filter}%' Or
		DNI Like '%${data.filter}%' Or
		email Like '%${data.filter}%' Or
		phone Like '%${data.filter}%' 
		limit ${data.init}, ${data.size};`)
	}catch(err) {
		return { err: err };
	}
}

Worker.countFiltered = async (data) => {
	try{
		return await sql.query(`SELECT count(*)  as dataLength from workers 
		Where 
		firstName Like '%${data.filter}%' Or 
		secondName Like '%${data.filter}%' Or 
		firstLastname Like '%${data.filter}%' Or
		secondLastname Like '%${data.filter}%' Or
		DNI Like '%${data.filter}%' Or
		email Like '%${data.filter}%' Or
		phone Like '%${data.filter}%' 
		;`)
	}catch (err) {
		return { err: err };
	}
}

Worker.Add = async (data) => {
	try {
		return await sql.query(`
		INSERT INTO workers (
			code,
			workerType,
			firstName,
			secondName,
			firstLastname,
			secondLastname,
			DNI,
			type,
			address,
			phone,
			email,
			medical,
			license,
			organization,
			membership,
			route,
			status,
			absences,
			observations,
			linkPhoto,
			dateInit,
			dateEnd
			) 
			VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`, [
			data.code,
			data.workerType,
			data.firstName,
			data.secondName,
			data.firstLastname,
			data.secondLastname,
			data.DNI,
			data.type,
			data.address,
			data.phone,
			data.email,
			data.medical,
			data.license,
			data.organization,
			data.membership,
			data.route,
			data.status,
			data.absences,
			data.observations,
			data.linkPhoto,
			data.dateInit,
			data.dateEnd,
		]);
	} catch (err) {
		return { err: err };
	}
}

Worker.Update = async(data) => {
	try {
		return await sql.query(`
		UPDATE workers SET 
		code = ?, 
		workerType = ?, 
		firstName = ?, 
		secondName = ?, 
		firstLastname = ?, 
		secondLastname = ?, 
		DNI = ?, 
		type = ?, 
		address = ?, 
		phone = ?, 
		email = ?, 
		medical = ?, 
		license = ?, 
		organization = ?, 
		membership = ?, 
		route = ?, 
		status = ?, 
		absences = ?, 
		observations = ?, 
		dateInit = ?, 
		dateEnd= ?
		WHERE (idWorker = ?);
		`
		,[
			data.code,
			data.workerType,
			data.firstName,
			data.secondName,
			data.firstLastname,
			data.secondLastname,
			data.DNI,
			data.type,
			data.address,
			data.phone,
			data.email,
			data.medical,
			data.license,
			data.organization,
			data.membership,
			data.route,
			data.status,
			data.absences,
			data.observations,
			data.dateInit,
			data.dateEnd,
			data.idWorker
		]);
	} catch (err) {
		return { err: err };
	}
}

Worker.Delete = async (id) => {
	try {
		return await sql.query('DELETE FROM workers WHERE (idWorker = ?)', [id]);
	} catch (err) {
		return { err: err };
	}
};

Worker.Last = async (id) => {
	try {
		return await sql.query('SELECT * FROM workers ORDER BY idWorker DESC LIMIT 1', [id]);
	} catch (err) {
		return { err: err };
	}
};

Worker.Dashboard = async () => {
	try {
		const allMembers= await sql.query('SELECT count(*)  as allMembers from workers;');
		const cabbie= await sql.query('SELECT count(*)  as cabbie from workers where workerType=0;');
		const collector= await sql.query('SELECT count(*)  as collector from workers where workerType=1;');
		const driver= await sql.query('SELECT count(*)  as driver from workers where workerType=2;');
		const moto= await sql.query('SELECT count(*)  as moto from workers where workerType=3;');
		const admn= await sql.query('SELECT count(*)  as admn from workers where workerType=4;');
		return [allMembers[0][0], cabbie[0][0], collector[0][0], driver[0][0], moto[0][0], admn[0][0]]; 
	} catch (err) {
		return { err: err };
	}
}

Worker.AddPhotoLink = async (data) => {
	try {
		return await sql.query('UPDATE workers SET linkPhoto = ? WHERE (idWorker =?);', [data.link ,data.id]);
	} catch (err) {
		return { err: err };
	}
}

module.exports = Worker;
