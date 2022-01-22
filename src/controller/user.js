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
exports.Authenticate = async (req, res, next) => {
    const password = req.body.password;
	let secret = 'some_secret';
    const data = {
		user1: req.body.username,
		pwd1: req.body.password,
	};
    const userVerified = await User.findEmail(req.body.username);
    if (userVerified.err) {
		console.log('Error in the database', userVerified.err);
		return res.status(400).json({ statusCode: 400, message: 'Error in the database' });
	}
}

