const jwt = require('jsonwebtoken');
const cloudinary = require('cloudinary');


const bcrypt = require('bcryptjs');
const path 			= require('path');
const fs 			= require('fs');
const saltRounds = 10;
const User = require('../database/user');


exports.List = async (req, res) => {
    const users = await User.List();
    const US= users[0][0]
    console.log('List employees', US);
    res.json(US);
} 


exports.fileAdd = (req, res) => {
    const files = req.files;
	const obj = JSON.parse(JSON.stringify(files));

    cloudinary.v2.uploader.upload(__basedir + '/resources/static/assets/uploads/' + obj.myFile[0].originalname,  { overwrite: true, },
    function(error, result) {
        
        console.log('Ojoooo',result, error)
        const response = {
            result: JSON.stringify(result),
            error: error
        }
        fs.unlink(path.join(__basedir + '/resources/static/assets/uploads/', obj.myFile[0].originalname), (err) => {
			if (err) throw err;
		});
        return res.json(response);
    });


}
