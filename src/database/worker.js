const sql = require('./database');

const Worker = function (worker) {
	this.firstName = worker.firstName;
	this.firstLastname = worker.firstLastname;
};
Worker.Profile = async (id)=> {
	try {
		return await sql.query('SELECT * FROM bgoescmoyuocwga4lecd.workers WHERE (idWorker = ?)', [id]);
	} catch (err) {
		return { err: err };
	}
}
Worker.List = async (data) => {
	try {
		return await sql.query('call bgoescmoyuocwga4lecd.list_workers(?, ?)',[data.init, data.size]);
	} catch (err) {
		return { err: err };
	}
};

Worker.Add = async (data) => {
	try {
		return await sql.query(`
		INSERT INTO bgoescmoyuocwga4lecd.workers (
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
			linkQR,
			dateInit,
			dateEnd
			) 
			VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`, [
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
			data.linkQR,
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
		UPDATE bgoescmoyuocwga4lecd.workers SET 
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
		linkQR = ?,
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
			data.linkQR,
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
		return await sql.query('DELETE FROM bgoescmoyuocwga4lecd.workers WHERE (idWorker = ?)', [id]);
	} catch (err) {
		return { err: err };
	}
};

Worker.Last = async (id) => {
	try {
		return await sql.query('SELECT * FROM bgoescmoyuocwga4lecd.workers ORDER BY idWorker DESC LIMIT 1', [id]);
	} catch (err) {
		return { err: err };
	}
};

Worker.Dashboard = async () => {
	try {
		return await sql.query('call bgoescmoyuocwga4lecd.dashboard_list();');
	} catch (err) {
		return { err: err };
	}
}

Worker.AddPhotoLink = async (data) => {
	try {
		return await sql.query('UPDATE bgoescmoyuocwga4lecd.workers SET linkPhoto = ? WHERE (idWorker =?);', [data.link ,data.id]);
	} catch (err) {
		return { err: err };
	}
}

module.exports = Worker;
