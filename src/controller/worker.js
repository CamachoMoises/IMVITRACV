const Worker = require('../database/worker');
const cloudinary = require('cloudinary');
const fs 			= require('fs');
const path 			= require('path');

exports.List = async (req, res) => {
    const worker = await Worker.List();
    const WK= worker[0];
    return res.json(WK);
}


exports.Add = async (req, res) => {
    const data = {
        code:req.body.code,
        workerType:req.body.workerType,
        firstName:req.body.firstName,
        secondName:req.body.secondName,
        firstLastname:req.body.firstLastname,
        secondLastname:req.body.secondLastname,
        DNI:req.body.DNI,
        type:req.body.type,
        address:req.body.address,
        phone:req.body.phone,
        email:req.body.email,
        medical:req.body.medical,
        license:req.body.license,
        organization:req.body.organization,
        membership:req.body.membership,
        route:req.body.route,
        status:req.body.status,
        absences:req.body.absences,
        observations:req.body.observations,
        linkPhoto:req.body.linkPhoto,
        linkQR:req.body.linkQR,
    }
    const add= await Worker.Add(data);
    if (add.err) {
		console.log('Error in the database', add.err);
		return res.status(400).json({ statusCode: 400, message: 'Error in the database', error: add.err });
	}

    return res.status(200).json({ statusCode: 200, message: `data saved` });

}
exports.Update = async (req, res) => {
    const data = {
        idWorker:req.params.id,
        code:req.body.code,
        workerType:req.body.workerType,
        firstName:req.body.firstName,
        secondName:req.body.secondName,
        firstLastname:req.body.firstLastname,
        secondLastname:req.body.secondLastname,
        DNI:req.body.DNI,
        type:req.body.type,
        address:req.body.address,
        phone:req.body.phone,
        email:req.body.email,
        medical:req.body.medical,
        license:req.body.license,
        organization:req.body.organization,
        membership:req.body.membership,
        route:req.body.route,
        status:req.body.status,
        absences:req.body.absences,
        observations:req.body.observations,
        linkPhoto:req.body.linkPhoto,
        linkQR:req.body.linkQR,
    }
    const update= await Worker.Update(data)

    if (update.err) {
		console.log('Error in the database', update.err);
		return res.status(400).json({ statusCode: 400, message: 'Error in the database', error: update.err });
	}

    return res.status(200).json({ statusCode: 200, message: `data updated` });

}

exports.Delete = async (req, res) =>{
    const id=req.params.id;
    console.log('id:', id);
    const deleted= await Worker.Delete(id);
    if (deleted.err){
		console.log('Error in the database delete deleted ' + deleted.err);
		return res.status(400).json({ statusCode: 400, message: 'Error in the database delete ' + deleted.err });
    }
    res.json('successful');
}

exports.fileAdd = (req, res) => {
    const files = req.files;
	const obj = JSON.parse(JSON.stringify(files));

    cloudinary.v2.uploader.upload(__basedir + '/resources/static/assets/uploads/' + obj.myFile[0].originalname,  { overwrite: true, },
    function(error, result) {
        
        console.log('Ojoooo',result, error)
        const response = {
            result: result,
            error: error
        }
        fs.unlink(path.join(__basedir + '/resources/static/assets/uploads/', obj.myFile[0].originalname), (err) => {
			if (err) throw err;
		});
        return res.json(response);
    });


}

