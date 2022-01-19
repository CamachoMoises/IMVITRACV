const jwt = require('jsonwebtoken');

const saltRounds = 10;
const User = require('../database/user');


exports.List = async (req, res) => {
    const users = await User.List();
    const US= users[0][0]
    console.log('List employees', US);
    res.json(US);
} 
