const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptJs');
const saltRounds = 10;
const User = require('../database/user');


exports.List = async (req, res, next) => {
    const users = await User.List();
    console.log('List employees');
    res.json('List employees');
} 
