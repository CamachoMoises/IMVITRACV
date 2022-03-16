const { getDatabase } = require('firebase-admin/database');
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');

const db = getDatabase();
const dbFire = getFirestore();

const WorkerFire = function (worker) {
	this.firstName = worker.firstName;
	this.firstLastname = worker.firstLastname;
};

WorkerFire.count = db.ref('workers_count');

WorkerFire.List = async (data) => {
	try {
		const snapshot = await dbFire.collection('Workers').orderBy('firstName').offset(data.init).limit(data.size).get();
		const response = [];
		snapshot.forEach((doc) => {
			// console.log(doc.id, '=>', doc.data());
			response.push({ ...{ idWorker: doc.id }, ...doc.data() });
		});
		return response;
	} catch (err) {
		return { err: err };
	}
};

WorkerFire.Profile= async (id) => {
	try {
		return dbFire.collection('Workers').doc(id).get();
	}catch (err) {
		return { err: err };
	}
}

WorkerFire.FilteredList = async (data) => {
	data.filter = data.filter.toLowerCase();

	//for create a str with the 
	// const strLength = data.filter.length;
	// const strFrontCode = data.filter.slice(0, strLength - 1);
	// const strEndCode = data.filter.slice(strLength - 1, data.filter.length);
	// This is an important bit..
	// const endCode = strFrontCode + String.fromCharCode(strEndCode.charCodeAt(0) + 1);
	// console.log(` endCode: ${endCode}, strFrontCode: ${strFrontCode}, strLength:${strLength}`);
	let filtered = [];
	let response = ['dummy'];
	let i = 0;
	while (response.length > 0 && filtered.length <= 20 ) {
		// console.log('start->  filtered:', filtered.length, ' response:',response.length, ' i:', i)
		response = [];
		const firstName = await dbFire.collection('Workers').limit(100).offset(i).get();
		firstName.forEach((doc) => {
			// console.log(doc.id, '=>', doc.data());
			response.push({ ...{ idWorker: doc.id }, ...doc.data() });
		});
		filtered = filtered.concat(response.filter((val) => val.firstName.toLowerCase().includes(data.filter) || val.secondName.toLowerCase().includes(data.filter) || val.firstLastname.toLowerCase().includes(data.filter) || val.phone.toLowerCase().includes(data.filter) || val.DNI.toLowerCase().includes(data.filter) || val.email.toLowerCase().includes(data.filter)));
		i = i + 100;
		// console.log('end->  filtered:', filtered.length, ' response:',response.length, ' i:', i)
	}
	//filtered = response.filter((val) => val.firstName.toLowerCase().includes(data.filter) || val.secondName.toLowerCase().includes(data.filter) || val.firstLastname.toLowerCase().includes(data.filter) || val.phone.toLowerCase().includes(data.filter) || val.DNI.toLowerCase().includes(data.filter) || val.email.toLowerCase().includes(data.filter));
	console.log(filtered.length);
	return filtered;
};

WorkerFire.Add = async (data) => {
	try {
		const workersRef = dbFire.collection('Workers');
		const added =await workersRef.add(data);
		return added.id;
	} catch (err) {
		console.log('error adding');
		return { err: err };
	}
};

WorkerFire.Update = async (data, id) => {
	try {
		const workersRef = dbFire.collection('Workers');
		const updated = await workersRef.doc(id).update(data);
		return updated;
	}catch (err) {
		return { err: err };
	}
}
WorkerFire.Delete = async (id) => {
	try {
		const workersRef = dbFire.collection('Workers');
		const deleted = await workersRef.doc(id).delete();
		return deleted;
	}catch (err) {
		return { err: err };
	}
}
WorkerFire.AddPhotoLink = async (data) => {
	try {
		const workersRef = dbFire.collection('Workers');
		return workersRef.doc(data.id).update({linkPhoto:data.link})
	}catch{
		return { err:err}
	}
}

module.exports = WorkerFire;
