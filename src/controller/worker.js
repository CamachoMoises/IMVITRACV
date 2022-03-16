const Worker = require('../database/worker');
const WorkerFire = require('../database/firebase/worker');
const cloudinary = require('cloudinary');
const fs = require('fs');
const path = require('path');

exports.List = async (req, res) => {
	const page = +req.params.page;
	const size = +req.params.size;
	const filter = req.params.filter;
	const init = (page + 1) * size - size;
	const properties = {
		init: init,
		size: size,
		filter: filter,
		page: page,
	};
	if (filter == 'Unfiltered') {
		let dataResponse = {};
		//const worker = await Worker.List(properties);
		//const WK = worker[0][0];
		//const dataLength = worker[0][1][0];
		const count = WorkerFire.count;
		count.on('value', (snap) => {
			snap.forEach((countWorker) => {
				dataResponse.dataLength = { dataLength: countWorker.val().value };
			});
		});
		const WorkerOnFireStore = await WorkerFire.List(properties);
		dataResponse = {
			...{
				//workersSQL: WK,
				workers: WorkerOnFireStore,
				//dataLengthSQL: dataLength,
			},
			...dataResponse,
		};
		return res.json(dataResponse);
	} else {
		const workerFire = await WorkerFire.FilteredList(properties);

		// const worker = await Worker.ListFiltered(properties);
		//const lengthResult = await Worker.countFiltered(properties);
		const dataResponse = {
			//workers: worker[0],
			workerFire: workerFire,
			//dataLength: lengthResult[0][0],
		};
		return res.json(dataResponse);
	}
};

exports.Add = async (req, res) => {
	const data = {
		code: req.body.code,
		workerType: +req.body.workerType,
		firstName: req.body.firstName,
		secondName: req.body.secondName,
		firstLastname: req.body.firstLastname,
		secondLastname: req.body.secondLastname,
		DNI: req.body.DNI,
		type: req.body.type,
		address: req.body.address,
		phone: req.body.phone,
		email: req.body.email,
		medical: req.body.medical,
		license: req.body.license,
		organization: req.body.organization,
		membership: req.body.membership,
		route: req.body.route,
		status: req.body.status,
		absences: req.body.absences,
		observations: req.body.observations,
		linkPhoto: req.body.linkPhoto,
		dateInit: req.body.dateInit,
		dateEnd: req.body.dateEnd,
	};
	const count = WorkerFire.count;
	let dataKey;
	let codes = 0;
	let value = 0;
	const optionW = ['cabbie', 'collector', 'driver', 'cabbie_biker'];
	let type = [0, 0, 0, 0];
	count.on('value', (snap) => {
		snap.forEach((countWorker) => {
			dataKey = countWorker.key;
			codes = +countWorker.val().code;
			value = +countWorker.val().value;
			type[0] = +countWorker.val().cabbie;
			type[1] = +countWorker.val().collector;
			type[2] = +countWorker.val().driver;
			type[3] = +countWorker.val().cabbie_biker;
		});
	});
	let workerType = 'OPE';
	if (data.workerType === 0) {
		workerType = 'TAX';
		data.type = null;
	} else if (data.workerType === 1) {
		data.type = null;
		workerType = 'COL';
	} else if (data.workerType === 3) {
		data.type = null;
		workerType = 'MOT';
	}
	setTimeout(async () => {
		console.log('dataKey', dataKey, code, value);
		const last = codes + 1;
		const lastOrder = last.toLocaleString('en', { minimumIntegerDigits: 4, useGrouping: false });
		data.code = `${workerType}-${lastOrder}`;
		const add = await WorkerFire.Add(data);
		if (add.err) {
			console.log('Error in the database', add.err);
			return res.status(400).json({ statusCode: 400, message: 'Error in the database', error: add.err });
		} else {
			let dataCount = {
				code: codes + 1,
				value: value + 1,
			};
			dataCount[optionW[data.workerType]] = type[data.workerType] + 1;
			count.child(dataKey).update(dataCount);
			return res.status(200).json({ statusCode: 200, message: `data saved`, id: add });
		}
	}, 1000);
	// const code = await Worker.Last();
};
exports.Update = async (req, res) => {
	const idWorker = req.params.id;
	const oldType = +req.body.oldType;
	const data = {
		code: req.body.code,
		workerType: +req.body.workerType,
		firstName: req.body.firstName,
		secondName: req.body.secondName,
		firstLastname: req.body.firstLastname,
		secondLastname: req.body.secondLastname,
		DNI: req.body.DNI,
		type: req.body.type,
		address: req.body.address,
		phone: req.body.phone,
		email: req.body.email,
		medical: req.body.medical,
		license: req.body.license,
		organization: req.body.organization,
		membership: req.body.membership,
		route: req.body.route,
		status: req.body.status,
		absences: req.body.absences,
		observations: req.body.observations,
		linkPhoto: req.body.linkPhoto,
		dateInit: req.body.dateInit,
		dateEnd: req.body.dateEnd,
	};
	const count = WorkerFire.count;
	let dataKey;
	const optionW = ['cabbie', 'collector', 'driver', 'cabbie_biker'];
	let type = [0, 0, 0, 0];
	count.on('value', (snap) => {
		snap.forEach((countWorker) => {
			dataKey = countWorker.key;
			type[0] = +countWorker.val().cabbie;
			type[1] = +countWorker.val().collector;
			type[2] = +countWorker.val().driver;
			type[3] = +countWorker.val().cabbie_biker;
		});
	});
	let workerType = 'OPE';
	if (data.workerType == 0) {
		workerType = 'TAX';
		data.type = null;
	} else if (data.workerType == 1) {
		data.type = null;
		workerType = 'COL';
	} else if (data.workerType == 3) {
		data.type = null;
		workerType = 'MOT';
	}
	const lastLetter = +data.code.toString().slice(data.code.length - 4);
	console.log('lastLetter', lastLetter);
	const code = lastLetter.toLocaleString('en', { minimumIntegerDigits: 4, useGrouping: false });
	data.code = `${workerType}-${code}`;
	setTimeout(async () => {
		const update = await WorkerFire.Update(data, idWorker);
		if (update.err) {
			console.log('Error in the database', update.err);
			return res.status(400).json({ statusCode: 400, message: 'Error in the database', error: update.err });
		}
		if(oldType !==  data.workerType){
			let dataCount = {}
			dataCount[optionW[data.workerType]] = type[data.workerType]+1
			dataCount[optionW[oldType]] = type[oldType]-1
			count.child(dataKey).update(dataCount);
		}
		return res.status(200).json({ statusCode: 200, message: `data updated` });
	}, 1000);
	// console.log('data', data);
	//const update = await Worker.Update(data);
};

exports.Delete = async (req, res) => {
	const id = req.params.id;
	const workerType= +req.params.workerType;
	const count = WorkerFire.count;
	const optionW = ['cabbie', 'collector', 'driver', 'cabbie_biker'];
	let dataKey;
	let value = 0;
	let countType= 0
	count.on('value', (snap) => {
		snap.forEach((countWorker) => {
			dataKey = countWorker.key;
			value = +countWorker.val().value;
			countType = +countWorker.val()[optionW[workerType]];
			console.log(`id to delete: ${id} , type: ${optionW[workerType]}, count:${countType} `);
		});
	});
	setTimeout(async () => {
		const deleted = await WorkerFire.Delete(id);
		if (deleted.err) {
			console.log('Error in the database delete deleted ' + deleted.err);
			return res.status(400).json({ statusCode: 400, message: 'Error in the database delete ' + deleted.err });
		}else{
			let dataCount = {}
			dataCount[optionW[workerType]] = countType-1;
			dataCount.value=value-1;
			count.child(dataKey).update(dataCount);
			res.json('successful');
		}
	}, 1000)

};

exports.fileAdd = (req, res) => {
	const id = req.params.id;
	const files = req.files;
	const obj = JSON.parse(JSON.stringify(files));

	cloudinary.v2.uploader.upload(
		__basedir + '/resources/static/assets/uploads/' + obj.myFile[0].originalname,
		{
			folder: 'INVITRACV',
			public_id: `file-worker-${id}`,
			overwrite: true,
		},
		async function (error, result) {
			const data = {
				link: result.secure_url,
				id: id,
			};
			const updated = await WorkerFire.AddPhotoLink(data);
			const response = {
				result: result,
			};
			if (updated.err || error) {
				console.log('Error in the database addlink ' + updated.err);
				return res.status(400).json({ statusCode: 400, message: 'Error in the database addlink ' + updated.err });
			}
			fs.unlink(path.join(__basedir + '/resources/static/assets/uploads/', obj.myFile[0].originalname), (err) => {
				if (err) throw err;
			});
			return res.json(response);
		}
	);
};

exports.Dashboard = async (req, res) => {
	const data = await Worker.Dashboard();
	if (data.err) {
		console.log('Error in the database Dashboard ' + data.err);
		return res.status(400).json({ statusCode: 400, message: 'Error in the database Dashboard ' + data.err });
	}
	const response = {
		allMembers: data[0][0][0].allMembers,
		cabbie: data[0][1][0].cabbie,
		collector: data[0][2][0].collector,
		driver: data[0][3][0].driver,
		moto: data[0][4][0].moto,
	};

	return res.json(response);
};

exports.QrLoad = async (req, res) => {
	const data = req.body.url;
	const data2 = 'https://res.cloudinary.com/moisesinc/image/upload/v1643142544/y6brji5cl3xi5qv3pkbg.jpg';
	console.log('url qr', data);
	// https.request(data, (res) => {
	// 	let steam = new Stream();
	// 	res.on('data', (chunk) => {
	// 		console.log('chunk', chunk);
	// 		steam.push(chunk);
	// 	});
	// 	res.on('end', () => {
	// 		fs.writeFileSync(__basedir+ '/resources/static/assets/temp//d1.jpg', steam.read() )
	// 	})
	// }).end();

	return res.json('Hola');
};
