const Worker = require('../database/worker');
const path 			= require('path');
const fs 			= require('fs');
const cloudinary = require('cloudinary');

exports.List = async (req, res) => {
    const worker = await Worker.List();
    const WK= worker[0][0]
    res.json(WK);
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

